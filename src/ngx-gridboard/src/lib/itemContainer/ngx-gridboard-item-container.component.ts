import {
  Component, Input, Output, OnInit, ViewChild, ViewChildren, ComponentFactoryResolver,
  EventEmitter, HostListener, ElementRef, Renderer2,
  QueryList, AfterViewInit, ContentChildren, AfterContentInit, forwardRef, KeyValueDiffers
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxGridboardService } from '../ngx-gridboard.service';
import { ResizeService } from '../resize.service';
import { PanelItem } from '../panel/panel-item';
import { PanelDirective } from '../panel/panel.directive';
import { PanelComponent } from '../panel/panel.component';
import { Item, ItemState, ItemSelection, ItemMouseEvent, Coords, Size, Dimensions } from '../item';
import { Class } from '../class.directive';
import { debounce } from '../decorators';

const topZIndex = 1000;
const bottomZIndex = 0;

@Component({
  selector: 'gb-item-container',
  templateUrl: './ngx-gridboard-item-container.component.html',
  styleUrls: ['./ngx-gridboard-item-container.component.css']
})
export class NgxGridboardItemContainerComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() layoutChangeEmitter: EventEmitter<any>;
  @Output() mouseDownEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();
  @Output() mouseMoveEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();
  @Output() mouseUpEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();

  panelComponent: PanelComponent;
  @ViewChild('outer') outer: ElementRef;
  @ViewChild('inner') inner: ElementRef;
  @ViewChild('header') header: ElementRef;
  @ViewChild(PanelDirective) panelHost: PanelDirective;


  mouseDown: any;
  enteredByMouse = false;
  inPress = false;
  direction: any;
  startMovePos: Coords;
  startMoveDimensions: Dimensions;
  moveDelta: Coords = { x: 0, y: 0 };
  pressStart: Coords = { x: 0, y: 0 };
  pressNormalizedLeftOffset = 0;
  pressNormalizedTopOffset = 0;
  zIndex = bottomZIndex;
  keyValueDiffer: any;
  changeCount = 0;
  scale = 0;

  top: number;
  left: number;
  width: number;
  height: number;
  resizeEmitter: EventEmitter<Size> = new EventEmitter<Size>();
  clickEmitter: EventEmitter<Size> = new EventEmitter<Size>();
  absPos: any;
  maximized: boolean;
  outerMouseDownListener: any;
  private _highlight: boolean;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight = true;
    this.enteredByMouse = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight = false;
    this.enteredByMouse = false;
  }

  @HostListener('mousemove', ['$event'])
  @debounce()
  onMouseMove(event) {
    if (!this.maximized) {
      this.handleMouseMove({ x: event.pageX, y: event.pageY });
    }
    return false;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    if (!this.maximized) {
      this.handleMouseUp({ x: event.pageX, y: event.pageY });
    }
    return false;
  }

  @HostListener('press', ['$event'])
  onPress(e) {
    if (!this.maximized) {
      const left = this.item.x * this.ngxGridboardService.options.cellWidth;
      const top = this.item.y * this.ngxGridboardService.options.cellHeight;
      const width = this.item.w * this.ngxGridboardService.options.cellWidth;
      const height = this.item.h * this.ngxGridboardService.options.cellHeight;
      this.setAbsPosition();
      this.pressStart = { x: e.center.x - (this.absPos.x), y: e.center.y - (this.absPos.y) };

      if (this.pressStart.y > this.ngxGridboardService.options.headerPx && !this.enteredByMouse) {
        this.inPress = true;
        this.pressNormalizedLeftOffset = (this.pressStart.x > left) ? (this.pressStart.x - left) / width : 0;
        this.pressNormalizedTopOffset = (this.pressStart.y > top) ? (this.pressStart.y - top) / height : 0;
        if (this.pressNormalizedLeftOffset > 0.3 && this.pressNormalizedLeftOffset < 0.7 && this.pressNormalizedTopOffset < 0.5) {
          this.item.resizeType = 'n-resize-handle';
        } else if ((this.pressNormalizedLeftOffset > 0.3 && this.pressNormalizedLeftOffset < 0.7) && this.pressNormalizedTopOffset >= 0.5) {
          this.item.resizeType = 's-resize-handle';
        } else if (this.pressNormalizedLeftOffset < 0.5) {
          this.item.resizeType = 'w-resize-handle';
        } else {
          this.item.resizeType = 'e-resize-handle';
        }
      }
    }
  }

  @HostListener('panstart', ['$event'])
  onHostPanStart(e) {
    if (!this.maximized) {
      if (this.inPress) {
        const pos = { x: e.center.x, y: e.center.y };
        this.handlePanStartEvent({ x: e.center.x, y: e.center.y });
      }
    }
    return false;
  }

  onPanStart(e) {
    if (!this.maximized) {
      const pos = { x: e.center.x, y: e.center.y };
      this.handlePanStartEvent({ x: e.center.x, y: e.center.y });
    }
    return false;
  }

  @HostListener('panmove', ['$event'])
  onPanMove(e) {
    if (!this.maximized) {
      if (this.inPress) {
        this.item.state = ItemState.Resize;
        this.inPress = false;
      }
      this.handleMouseMove({ x: e.center.x, y: e.center.y });
    }
    return false;
  }

  @HostListener('panend', ['$event'])
  onPanEnd(e) {
    if (!this.maximized) {
      this.handleMouseUp({ x: e.center.x, y: e.center.y });
      return false;
    }
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public ngxGridboardService: NgxGridboardService,
    private keyValueDiffers: KeyValueDiffers,
    private resizeService: ResizeService
  ) {
    this.keyValueDiffer = keyValueDiffers.find({}).create();
  }

  get highlight() {
    return this._highlight;
  }

  set highlight(value:boolean) {
    this._highlight = value;
    if (value) {
      this.renderer.setStyle(this.outer.nativeElement, 'border', this.ngxGridboardService.options.borderPx + 'px solid ' + this.ngxGridboardService.options.highlightColor);
    } else {
      this.renderer.setStyle(this.outer.nativeElement, 'border', this.ngxGridboardService.options.borderPx + 'px solid transparent');
    }
  }

  setAbsPosition() {
    let offsetLeft = 0;
    let offsetTop = 0;

    let el = this.elementRef.nativeElement;

    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    this.absPos = { x: offsetLeft, y: offsetTop }
  }


  get leftVal(): number {
    let left = (this.item) ? this.item.x * this.ngxGridboardService.options.cellWidth : 10;
    if (this.item.state === ItemState.Move) {
      left = (this.startMoveDimensions.x * this.ngxGridboardService.options.cellWidth) + this.moveDelta.x;
    }
    return left;
  }

  get topVal(): number {
    let top = (this.item) ? this.item.y * this.ngxGridboardService.options.cellWidth : 10;
    if (this.item.state === ItemState.Move) {
      top = (this.startMoveDimensions.y * this.ngxGridboardService.options.cellWidth) + this.moveDelta.y;
    }
    return top;
  }

  get widthVal(): number {
    let width = (this.item) ? this.item.w * this.ngxGridboardService.options.cellWidth : 10;
    return width;
  }

  get heightVal(): number {
    const height = (this.item) ? this.item.h * this.ngxGridboardService.options.cellHeight : 10;
    return height;
  }

  ngOnInit() {
    this.loadComponent();
    this.item.state = ItemState.Stopped;
    this.item.elementRef = this.elementRef;

    this.mouseUpEmitter.subscribe(() => {
      this.highlight = false;
    });

    this.layoutChangeEmitter.subscribe(() => {
      this.setRect()
    });

    // this.header.nativeElement.style.height = this.ngxGridboardService.options.headerPx + 'px';
    this.inner.nativeElement.style.top = this.ngxGridboardService.options.headerPx + 'px';
    this.highlight = false;
    this.setRect();
    this.clickEmitter.subscribe((selection: ItemSelection) => {
      if (selection === ItemSelection.Close) {
        this.deleteItem();
      } else if (selection === ItemSelection.Maximize) {
        this.maximizeItem();
      } else if (selection === ItemSelection.Minimize) {
        this.minimizeItem();
      }
    });
    this.resizeService.onResize$.subscribe(result => {
      if (this.maximized) {
        this.height = this.ngxGridboardService.gridboard.gridContainer.nativeElement.clientHeight;
        this.width = this.ngxGridboardService.gridboard.gridContainer.nativeElement.clientWidth;
        this.emitResize();
      }
    });
  }

  handleIf(itemSelection:ItemSelection) {
    let result = true;
    if (itemSelection === ItemSelection.Maximize && this.maximized) {
      result = false;
    } else if (itemSelection === ItemSelection.Minimize && !this.maximized) {
      result = false;
    }
    return result;
  }

  maximizeItem() {
    this.maximized = true;
    this.ngxGridboardService.maximizedItem = this.item;

    this.left = 0;
    this.top = 0;
    this.height = this.ngxGridboardService.gridboard.gridContainer.nativeElement.clientHeight;
    this.width = this.ngxGridboardService.gridboard.gridContainer.nativeElement.clientWidth;
    this.emitResize();
  }

  minimizeItem() {
    this.maximized = false;
    this.ngxGridboardService.maximizedItem = undefined;
    this.item.state = ItemState.Stopped;
    this.left = this.leftVal;
    this.top = this.topVal;
    this.width = this.widthVal;
    this.height = this.heightVal;
    this.emitResize();
  }

  setupMouseDown(event) {
    if (!this.maximized) {
      this.handleMouseDownEvent(event);
      this.setAbsPosition();
      this.pressStart = { x: event.pageX - (this.absPos.x), y: event.pageY - (this.absPos.y) };
      if (this.pressStart.y <= this.ngxGridboardService.options.headerPx) {
        this.handleMouseDown({ x: event.pageX, y: event.pageY });
      }
    }
    return false;
  }


  ngAfterViewInit() {
    this.outerMouseDownListener = this.renderer.listen(this.outer.nativeElement, 'mousedown', (event) => {
      this.setupMouseDown(event);
    });
    this.setRect();
  }

  ngDoCheck() {
    this.handleItemChanges(this.keyValueDiffer.diff(this.item));
  }

  private handleItemChanges(changes: any): void {
    if (changes) {
      changes.forEachChangedItem(r => {
        if (r.key === 'x' || r.key === 'y' || r.key === 'w' || r.key === 'h' || r.key === 'state') {
          this.setRect();
        }
      });
    }
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.panelItem.component);

    const viewContainerRef = this.panelHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.panelComponent = <PanelComponent>componentRef.instance;
    (<PanelComponent>componentRef.instance).data = this.item.panelItem.data;
    (<PanelComponent>componentRef.instance).resizeEmitter = this.resizeEmitter;
    (<PanelComponent>componentRef.instance).clickEmitter = this.clickEmitter;
    (<PanelComponent>componentRef.instance).item = this.item;

    this.item.containerComponent = this;
  }

  handlePanStartEvent(pos: Coords) {
    this.handleMouseDown(pos);
  }

  handleMouseDownEvent(event: any) {
    const pos = { x: event.pageX, y: event.pageY };
    this.handleMouseDown(pos);
  }

  handleMouseDown(pos: Coords) {
    this.zIndex = topZIndex;
    if (!(this.item.state === ItemState.Resize)) {
      this.item.state = ItemState.Move;
    }
    this.highlight = true;
    this.ngxGridboardService.activeItem = this.item;
    this.startMovePos = pos;
    this.startMoveDimensions = { x: this.item.x, y: this.item.y, w: this.item.w, h: this.item.h };
    this.moveDelta = { x: 0, y: 0 };
    this.mouseDownEmitter.emit({ pos: pos, item: this.item });
  }

  handleMouseMove(pos: Coords) {
    if (this.item.state === ItemState.Move || this.item.state === ItemState.Resize) {
      this.moveDelta = { x: pos.x - this.startMovePos.x, y: pos.y - this.startMovePos.y };
      if (this.item.state === ItemState.Move) {
        this.setRect();
      }
      else {
        this.setResizeRect();
      }
    }
  }

  handleMouseUp(pos: Coords) {
    this.zIndex = bottomZIndex;
    this.moveDelta = { x: 0, y: 0 };
    this.mouseUpEmitter.emit({ pos: pos, item: this.item });
  }

  itemResizeMouseDown(result: ItemMouseEvent) {
    this.item.state = ItemState.Resize;
    this.handleMouseDown(result.pos);
  }

  setRect() {
    if (this.maximized) {
      this.maximizeItem();
    }
    else {
      this.left = this.leftVal;
      this.top = this.topVal;
      this.width = this.widthVal;
      this.height = this.heightVal;
      this.emitResize();
    }
  }

  emitResize() {
    const indentSize = ((this.ngxGridboardService.options.marginPx + this.ngxGridboardService.options.borderPx + 3) * 2);
    this.resizeEmitter.emit({ w: this.width - indentSize, h: this.height - indentSize - this.ngxGridboardService.options.headerPx });
  }

  setResizeRect() {
    const left = this.startMoveDimensions.x * this.ngxGridboardService.options.cellWidth;
    const top = this.startMoveDimensions.y * this.ngxGridboardService.options.cellHeight;
    const width = this.startMoveDimensions.w * this.ngxGridboardService.options.cellWidth;
    const height = this.startMoveDimensions.h * this.ngxGridboardService.options.cellHeight;
    if (this.item.resizeType === 'ew-resize-handle') {
      this.width = width * this.scale;
    }

    if (this.item.resizeType === 'ns-resize-handle') {
      this.height = height * this.scale;
    }

    if (this.item.resizeType === 'se-resize-handle' || this.item.resizeType === 'e-resize-handle' || this.item.resizeType === 'ne-resize-handle') {
      this.width = width + this.moveDelta.x;
    }

    if (this.item.resizeType === 'w-resize-handle' || this.item.resizeType === 'nw-resize-handle' || this.item.resizeType === 'sw-resize-handle') {
      if (width - this.moveDelta.x < 0) {
        this.left = left - width;
        this.width = 0;
      } else {
        this.left = left + this.moveDelta.x;
        this.width = width - this.moveDelta.x;
      }
    }

    if (this.item.resizeType === 'se-resize-handle' || this.item.resizeType === 's-resize-handle' || this.item.resizeType === 'sw-resize-handle') {
      this.height = top + height + this.moveDelta.y;
    }

    if (this.item.resizeType === 'ne-resize-handle' || this.item.resizeType === 'n-resize-handle' || this.item.resizeType === 'nw-resize-handle') {
      if (height - this.moveDelta.y < 0) {
        this.top = top - height;
        this.height = 0;
      } else {
        this.top = top + this.moveDelta.x;
        this.height = height + this.moveDelta.x;
      }
    }
    this.emitResize();
  }

  deleteItem() {
    this.ngxGridboardService.deleteItem(this.item);
    this.ngxGridboardService.activeItem = null;
  }


}
