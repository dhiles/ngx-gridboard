
import {
  Component, Directive, HostListener,
  Input, Output, Query, EventEmitter, AfterContentInit,
  AfterViewInit, ViewChild, ContentChildren, ViewChildren,
  QueryList, forwardRef, Inject, ElementRef, Renderer2, ChangeDetectorRef,
  ComponentFactoryResolver, OnInit, OnDestroy, KeyValueDiffers, IterableDiffers, KeyValueChangeRecord, DoCheck
} from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subject, fromEvent, of, Subscription } from 'rxjs';
import { map, filter, catchError, mergeMap, throttleTime } from 'rxjs/operators';
// import { containsTree } from '@angular/router/src/url_tree';
import { Item, ItemState, ItemMouseEvent, Coords } from './item';
import { PanelItem } from './panel/panel-item';
import { PanelDirective } from './panel/panel.directive';
import { PanelComponent } from './panel/panel.component';
import { GridList, GridListHelper } from './gridList/gridList';
import { NgxGridboardService, vertical } from './ngx-gridboard.service';
import { WindowEventService } from './window-event.service';
import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-item-container.component'
import { Class } from './class.directive';

export class LaneChange {
  mq: string;
  lanes: number;
}

export class ItemChange {
  item: Item;
}

@Component({
  selector: 'gb-gridboard',
  templateUrl: './ngx-gridboard.component.html',
  styleUrls: ['ngx-gridboard.component.css']
})
export class NgxGridboardComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  currentMq: any;
  pos: Coords = { x: 0, y: 0 };
  name: string;
  _items: any;
  initialItems: any;
  gridList: any;
  gridElement: any;
  mouseMoves: any;
  inputValue: string;
  previousDragPosition: Coords = null;
  maxItemWidth: number;
  maxItemHeight: number;
  _previousDragPosition: any;
  keyValueDiffer: any;
  iterableDiffer: any;
  itemDiffer: any;
  initialized = false;
  moveSubscription: Subscription;
  resizeSubscription: Subscription;
  layoutChangeEmitter: EventEmitter<any> = new EventEmitter();
  gridContainerEl: any;
  panelHidden: boolean;
  responsiveContentLoaded: boolean;
  _width: number;
  _height: number;
  mouseMoves$: Subject<any> = new Subject<any>();

  get width() {
    return this._width;
  }

  set width(w) {
    this._width = w;
  }

  get height() {
    return this._height;
  }

  set height(h) {
    this._height = h;
  }

  get visibleHeight() {
    return window.innerHeight - this.gridContainer.nativeElement.offsetTop +
      (window.scrollY === undefined ? window.pageYOffset : window.scrollY);
  }

  @Input() items: any;
  @Input() options: any;
  @Input() itemUpdateEmitter: EventEmitter<any>;
  @Output() laneChange: EventEmitter<LaneChange> = new EventEmitter();
  @Output() itemChange: EventEmitter<ItemChange> = new EventEmitter();
  @ViewChild('gridContainer', { static: true }) gridContainer: ElementRef;
  @ViewChild('positionHighlightItem', { static: true }) positionHighlight: ElementRef;
  @ViewChild('highlightItem', { static: true }) dragElement: ElementRef;
  @ViewChildren(Class, { read: ElementRef }) classes: QueryList<ElementRef>;

  @HostListener('panmove', ['$event'])
  onPanMove(e) {
    if (this.ngxGridboardService.activeItem) {
      this.mouseMoves$.next(e);
    }
  }

  @HostListener('panend', ['$event'])
  onPanEnd(e: any) {
    // alert("pan end");
    if (this.ngxGridboardService.activeItem) {
      this.itemMouseUp({ pos: { x: e.center.x, y: e.center.y }, item: this.ngxGridboardService.activeItem });
    }
  }

  @HostListener('panstart', ['$event'])
  onPanStart(e: any) {
    // console.log('panstart');
  }

  constructor(
    private eventManager: EventManager,
    public elementRef: ElementRef,
    public renderer: Renderer2,
    public media: MediaObserver,
    public ngxGridboardService: NgxGridboardService,
    private windowEventService: WindowEventService,
    private keyValueDiffers: KeyValueDiffers,
    private iterableDiffers: IterableDiffers,
    private changeDetector: ChangeDetectorRef
  ) {
    this.keyValueDiffer = keyValueDiffers.find({}).create();
    this.iterableDiffer = iterableDiffers.find([]).create(null);
    /// this.itemDiffer = [];
    // this.items.forEach((item) => {
    //   this.itemDiffer[item] = this.keyValueDiffer.diff(item);
    // });
    windowEventService.onResizeEnd$.subscribe(e => this.sizeColumns());
  }

  ngDoCheck() {
    if (this.initialized) {
      this.handleOptionsChanges(this.keyValueDiffer.diff(this.options));
      this.handleItemsArrayChanges(this.iterableDiffer.diff(this.items));
      //   this.items.forEach((item) => {
      //     this.itemDiffer[item] = this.keyValueDiffer.diff(item);
      //   });
    }
  }

  private handleOptionsChanges(changes: any): void {
    if (changes) {
      changes.forEachChangedItem(r => {
        if (r.key === 'fixedLanes') {
          this.resizeGrid(this.options.fixedLanes);
        }
      });
    }
  }

  private handleItemsChanges(changes: any): void {
    if (changes) {
      changes.forEachChangedItem(r => {
        if (r.key === 'tobeDeleted') {
          alert('to be deleted');
        }
      });
    }
  }

  private handleItemsArrayChanges(changes: any): void {
    if (!this.itemUpdateEmitter && changes) {
      changes.forEachAddedItem((record) => {
        this.gridList.moveItemToPosition(record.item, [record.item.x, record.item.y]);
        this.render();
      });
    }
  }

  setContainerSize() {
    this.width = this.gridContainer.nativeElement.clientWidth;
    this.height = this.gridContainer.nativeElement.clientHeight;
  }

  sizeColumns() {
    this.setContainerSize();
    this.currentMq = this.ngxGridboardService.getMqBreakpoint(this.width);
    this.options.fixedLanes = this.options.mediaQueryLanes[this.currentMq];
    if (!this.gridList) {
      this.gridList = new GridList(this.items, {
        lanes: this.options.fixedLanes,
        direction: this.options.direction
      });
    }
    this.calculateCellSize();
    this.gridList.resizeGrid(this.options.fixedLanes);
    this.render();
  }

  ngOnInit() {
    this.ngxGridboardService.options = this.options;
    this.ngxGridboardService.gridboard = this;
    this.sizeColumns();
    this.sizeColumns();
    if (this.itemUpdateEmitter) {
      this.itemUpdateEmitter.subscribe((request: any) => {
        if (request.operation === 'add') {
          let x = request.item.x;
          let y = request.item.y;
          if (request.lanePosition === 'last') {
            if (this.options.direction === vertical) {
              x = 0;
              for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].y === y && this.items[i].x + this.items[i].w > x) {
                  x = this.items[i].x + this.items[i].w;
                }
              }
            } else {
              y = 0;
              for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].x === x && this.items[i].y + this.items[i].h > y) {
                  y = this.items[i].y + this.items[i].h;
                }
              }
            }
          }
          this.items.push(request.item);
          this.gridList.moveItemToPosition(request.item, [x, y]);
          this.render();
        }
      });
      
    }

    this.moveSubscription = this.mouseMoves$.asObservable().pipe(throttleTime(100))
      .subscribe((e: any) => {
        console.log("gridboard mouseMoves$ item panmove" + " x=" + e.center.x + " y=" + e.center.y);
        this.itemMouseMove({ pos: { x: e.center.x, y: e.center.y }, item: this.ngxGridboardService.activeItem });
      });
  }

  calcLanes() {
    if (this.options.direction === vertical) {
      const width = this.width;
      const maxClientWidth = this.getMaxItemsWidth();

      if (width <= maxClientWidth * this.options.cellWidth) {
        if (this.options.fixedLanes > 1) {
          this.options.fixedLanes -= 1;
        }
      }

      if (width - (this.options.fixedLanes * this.options.cellWidth) > this.options.cellWidth) {
        this.currentMq = this.ngxGridboardService.getMqBreakpoint(width);
        this.options.fixedLanes = this.options.mediaQueryLanes[this.currentMq];
      }
    }
  }

  ngAfterViewInit() {
    this.doAfterViewInit();
  }

  ngOnDestroy() {
    this.moveSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }

  doAfterViewInit() {
    this.ngxGridboardService.setStyles('gridContainer', this.classes);
    this.removePositionHighlight();
    this.calculateCellSize();
    this.render();
    this.changeDetector.detectChanges();
    this.gridContainerEl = this.gridContainer.nativeElement;
    this.initialized = true;
  }

  render() {
    this.sizeGridContainer();
    this.layoutChangeEmitter.emit();
  }

  getMaxItemWidth() {
    let maxWidth = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].w > maxWidth) {
        maxWidth = this.items[i].w;
      }
    }
    return maxWidth;
  }

  getMaxItemHeight() {
    let maxHeight = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].h > maxHeight) {
        maxHeight = this.items[i].w;
      }
    }
    return maxHeight;
  }

  getMaxItemsWidth() {
    let maxWidth = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].x + this.items[i].w > maxWidth) {
        maxWidth = this.items[i].x + this.items[i].w;
      }
    }
    return maxWidth;
  }

  getMaxItemsHeight() {
    let maxHeight = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].y + this.items[i].h > maxHeight) {
        maxHeight = this.items[i].y + this.items[i].h;
      }
    }
    return maxHeight;
  }

  resizeGrid(lanes: number) {
    this.gridList.resizeGrid(lanes);
    this.render();
  }

  resizeItem(item: any, width: number, height: number) {
    this.gridList.resizeItem(item, { w: width, h: height });
    this.render();
  }

  deleteItem(item: Item) {
    this.gridList.resizeItem(item, { w: 1, h: 1 });
    const x = (this.options.direction === vertical) ? 0 : 1000;
    const y = (this.options.direction === vertical) ? 1000 : 0;
    this.gridList.moveItemToPosition(item, [x, y]);
    const i = this.items.indexOf(item);
    if (i > -1) {
      this.items.splice(i, 1);
    }
    this.render();
  }

  highlightPositionForItem(item: Item) {
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'width', item.w * this.ngxGridboardService.options.cellWidth + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'height', item.h * this.ngxGridboardService.options.cellHeight + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'left', item.x * this.ngxGridboardService.options.cellWidth + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'top', item.y * this.ngxGridboardService.options.cellHeight + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'display', 'inline');

    if (this.options.heightToFontSizeRatio) {
      this.renderer.setStyle(this.positionHighlight.nativeElement, 'font-size', this.ngxGridboardService.fontSize);
    }
  }

  removePositionHighlight() {
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'display', 'none');
  }

  calculateCellSize() {
    this.ngxGridboardService.options.cellWidth = Math.floor(this.width / this.options.fixedLanes);
    this.ngxGridboardService.options.cellHeight = this.ngxGridboardService.options.cellWidth / this.ngxGridboardService.widthHeightRatio;
    if (this.options.heightToFontSizeRatio) {
      this.ngxGridboardService.fontSize = this.ngxGridboardService.options.cellHeight * this.ngxGridboardService.heightToFontSizeRatio;
    }
  }

  sizeGridContainer() {
    // Update the width or height of the entire grid container with enough room on the
    // right or bottom to allow dragging items to the end of the grid.
    if (this.options.direction !== vertical) {
      const gridWidth = (this.ngxGridboardService.options.gridContainer && this.ngxGridboardService.options.gridContainer.width) ?
        this.ngxGridboardService.options.gridContainer.width :
        (this.getMaxItemsWidth() + 1) * this.ngxGridboardService.options.cellWidth;
      this.renderer.setStyle(this.gridContainer.nativeElement, 'width', gridWidth + 'px');
      const gridHeight = (this.ngxGridboardService.options.gridContainer && this.ngxGridboardService.options.gridContainer.height) ?
        this.ngxGridboardService.options.gridContainer.height :
        (this.getMaxItemsHeight() + 1) * this.ngxGridboardService.options.cellHeight;
      this.renderer.setStyle(this.gridContainer.nativeElement, 'height', gridHeight + 'px');

    } else {
      const gridHeight = (this.ngxGridboardService.options.gridContainer && this.ngxGridboardService.options.gridContainer.height) ?
        this.ngxGridboardService.options.gridContainer.height :
        (this.getMaxItemsHeight() + 1) * this.ngxGridboardService.options.cellHeight;
      this.renderer.setStyle(this.gridContainer.nativeElement, 'height', gridHeight + 'px');
    }
  }

  itemMouseDown(result: ItemMouseEvent) {
    this.initialItems = GridListHelper.cloneItems(this.items);
  }

  itemMouseUp(result: ItemMouseEvent) {
    this.ngxGridboardService.activeItem = result.item;
    this.handleItemMouseUp();
  }

  handleItemMouseUp() {
    if (this.ngxGridboardService.activeItem) {
      // this.fixIntermediateStates();
      this.onStop();
      this.ngxGridboardService.activeItem = null;
    }
  }

  fixIntermediateStates() {
    const changedItems = [];
    for (let i = 0; i < this.initialItems.length; i++) {
      if (this.items[i].x !== this.initialItems[i].x ||
        this.items[i].y !== this.initialItems[i].y &&
        this.items[i] !== this.ngxGridboardService.activeItem) {
        changedItems.push(this.items[i]);
      }
    }
  }

  itemMouseMove(result: ItemMouseEvent) {
    this.handleItemMouseMove(result.pos, result.item);
  }

  handleItemMouseMove(pos: Coords, item: any) {
    const self = this;
    if (item.state === ItemState.Move || item.state === ItemState.Resize) {
      this.onDrag(this.ngxGridboardService.activeItem);
    }
  }

  onDrag(item: any) {
    if (item.state === ItemState.Move) {
      const newPosition = this.snapItemPositionToGrid(item);

      if (this.dragPositionChanged(newPosition)) {
        this._previousDragPosition = newPosition;

        this.gridList.moveItemToPosition(item, newPosition);

        // Visually update item positions and highlight shape
        this.sizeGridContainer();
        this.highlightPositionForItem(item);
      }
    } else if (item.state === ItemState.Resize) {
      const newPosition = this.snapItemPositionToGrid(item);
      const offsetWidth = item.elementRef.nativeElement.offsetWidth === 0 ?
        1 : item.elementRef.nativeElement.offsetWidth;
      const offsetHeight = item.elementRef.nativeElement.offsetHeight === 0 ?
        1 : item.elementRef.nativeElement.offsetHeight;
      const width = Math.round(offsetWidth / this.ngxGridboardService.options.cellWidth);
      const height = Math.round(offsetHeight / this.ngxGridboardService.options.cellHeight);

      if (this.dragPositionChanged(newPosition) || item.w !== width || item.h !== height) {
        this._previousDragPosition = newPosition;

        this.gridList.resizeItem(item, { w: width, h: height });
        this.gridList.moveItemToPosition(item, newPosition);

        this.itemChange.emit({ item: item });

        // Visually update item positions and highlight shape
        this.sizeGridContainer();
        this.highlightPositionForItem(item);
        // item.containerComponent.resize();
      }
    }
  }

  onStop() {
    this.ngxGridboardService.activeItem.state = ItemState.Stopped;
    this._previousDragPosition = null;
    this.sizeGridContainer();
    this.removePositionHighlight();
  }

  dragPositionChanged(newPosition: any) {
    if (!this._previousDragPosition) {
      return true;
    }
    return (newPosition[0] !== this._previousDragPosition[0] ||
      newPosition[1] !== this._previousDragPosition[1]);
  }

  snapItemPositionToGrid(item: any) {
    const positionLeft = item.elementRef.nativeElement.offsetLeft;
    const positionTop = item.elementRef.nativeElement.offsetTop;

    let col = positionLeft === 0 ? 0 : Math.round(positionLeft / this.ngxGridboardService.options.cellWidth),
      row = positionTop === 0 ? 0 : Math.round(positionTop / this.ngxGridboardService.options.cellHeight);

    // Keep item position within the grid and don't let the item create more
    // than one extra column
    col = Math.max(col, 0);
    row = Math.max(row, 0);

    if (this.options.direction !== vertical) {
      col = Math.min(col, this.gridList.grid.length);
      row = Math.min(row, this.options.fixedLanes - item.h);
    } else {
      col = Math.min(col, this.options.fixedLanes - item.w);
      row = Math.min(row, this.gridList.grid.length);
    }
    return [col, row];
  }

}
