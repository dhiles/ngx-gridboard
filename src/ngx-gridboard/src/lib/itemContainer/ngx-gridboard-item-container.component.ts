import {
  Component, Input, Output, OnInit, ViewChild, ViewChildren, ViewEncapsulation, ComponentFactoryResolver,
  EventEmitter, HostListener, HostBinding, ElementRef, Renderer2,
  QueryList, AfterViewInit, ContentChildren, AfterContentInit, forwardRef, KeyValueDiffers
} from '@angular/core';
import { Subject, ReplaySubject, fromEvent } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import { NgxGridboardService, vertical } from '../ngx-gridboard.service';
import { WindowEventService } from '../window-event.service';
import { PanelItem } from '../panel/panel-item';
import { PanelDirective } from '../panel/panel.directive';
import { PanelComponent } from '../panel/panel.component';
import { Item, ItemState, ItemSelection, ItemMouseEvent, Coords, Size, Dimensions, Layout } from '../item';
import { MyClassElement } from '../class.directive';
import { GridboardItemContainer } from './gridboard-item-container.interface';

const topZIndex = 1000;
const bottomZIndex = 0;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gb-item-container',
  templateUrl: './ngx-gridboard-item-container.component.html',
  styleUrls: ['./ngx-gridboard-item-container.component.css']
})
export class NgxGridboardItemContainerComponent implements OnInit, AfterViewInit, GridboardItemContainer {
  @Input() item: Item;
  @Input() layoutChangeEmitter: EventEmitter<any>;
  @Output() mouseDownEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();
  @Output() mouseMoveEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();
  @Output() mouseUpEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();

  panelComponent: PanelComponent;
  @ViewChild('outer', { static: true } ) outer: ElementRef;
  @ViewChild('inner', { static: true } ) inner: ElementRef;
  @ViewChild('header', { static: true } ) header: ElementRef;
  @ViewChild(PanelDirective, { static: true } ) panelHost: PanelDirective;


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
  keyValueDiffer: any;
  changeCount = 0;
  scale = 0;
  indent: number

  resizeEmitter: EventEmitter<Size> = new EventEmitter<Size>();
  layout$ = new ReplaySubject<Layout>()
  clickEmitter: EventEmitter<Size> = new EventEmitter<Size>();
  absPos: any;
  maximized: boolean;
  outerMouseDownListener: any;
  private _highlight: boolean;
  mouseMoves$: Subject<any> = new Subject<any>();

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight = true;
    this.enteredByMouse = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight = false;
    this.enteredByMouse = false;
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
      this.mouseMoves$.next(e);
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

  @HostBinding('style.left.px') leftPx
  @HostBinding('style.top.px') topPx
  @HostBinding('style.width.px') widthPx
  @HostBinding('style.height.px') heightPx
  @HostBinding('style.z-index') zIndexPx

  _zIndex: number = bottomZIndex
  get zIndex():number {
    return this._zIndex
  }
  set zIndex(val:number) {
    this._zIndex = val
  }

  _top: number;
  get top():number {
    return this._top
  }
  set top(val:number) {
    this._top = val
    this.topPx = this.top
    this.layout$.next({top: this.top, left: this.top,width: this.width, height: this.height, indent: this.ngxGridboardService.indentPx})    
  }

  _left: number;
  get left():number {
    return this._left
  }
  set left(val:number) {
    this._left = val
    this.leftPx = this.left
    this.layout$.next({top: this.top, left: this.top,width: this.width, height: this.height, indent: this.ngxGridboardService.indentPx})    
  }

  _width: number;
  get width():number {
    return this._width
  }
  set width(val:number) {
    this._width = val
    this.widthPx = this.width
    this.layout$.next({top: this.top, left: this.top,width: this.width, height: this.height, indent: this.ngxGridboardService.indentPx})    
  }

  _height: number;
  get height():number {
    return this._height
  }
  set height(val:number) {
    this._height = val
    this.heightPx = this.height
    this.layout$.next({top: this.top, left: this.top,width: this.width, height: this.height, indent: this.ngxGridboardService.indentPx})    
  }


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public ngxGridboardService: NgxGridboardService,
    private keyValueDiffers: KeyValueDiffers,
    private windowEventService: WindowEventService
  ) {
    this.keyValueDiffer = keyValueDiffers.find({}).create();
  }

  get description() {
    return this.panelComponent.item.description ? this.panelComponent.item.description : "";
  }

  get highlight() {
    return this._highlight;
  }

  set highlight(value: boolean) {
    this._highlight = value;
    if (value) {
      this.renderer.setStyle(this.outer.nativeElement, 'border',
        this.ngxGridboardService.options.borderPx + 'px solid ' + this.ngxGridboardService.options.highlightColor);
    } else {
      this.renderer.setStyle(this.outer.nativeElement,
        'border', this.ngxGridboardService.options.borderPx + 'px solid transparent');
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
    const width = (this.item) ? this.item.w * this.ngxGridboardService.options.cellWidth : 10;
    return width;
  }

  get heightVal(): number {
    const height = (this.item) ? this.item.h * this.ngxGridboardService.options.cellHeight : 10;
    return height;
  }

  ngOnInit() {
    this.loadComponent();
    this.leftPx = this.item.containerComponent.left
    this.topPx = this.item.containerComponent.top
    this.widthPx = this.item.containerComponent.width
    this.heightPx = this.item.containerComponent.height
    this.zIndex = this.item.containerComponent.zIndex

    this.item.state = ItemState.Stopped;
    this.item.elementRef = this.elementRef;
    this.mouseMoves$.asObservable().pipe(throttleTime(100))
      .subscribe((e:any) => {
      console.log("item panmove" + " x=" + e.center.x + " y=" + e.center.y);
      this.handleMouseMove({ x: e.center.x, y: e.center.y });
    });
    this.mouseUpEmitter.subscribe(() => {
      this.highlight = false;
    });

    this.layoutChangeEmitter.subscribe(() => {
      this.setRect();
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
    this.windowEventService.onResize$.subscribe(result => {
      if (this.maximized) {
        this.setMaximizedSize();
        this.emitResize();
      }
    });

  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.panelItem.component);

    const viewContainerRef = this.panelHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.panelComponent = <PanelComponent>componentRef.instance;
    (<PanelComponent>componentRef.instance).data = this.item.panelItem.data;
    (<PanelComponent>componentRef.instance).resizeEmitter = this.resizeEmitter;
    (<PanelComponent>componentRef.instance).layout$ = this.layout$;
    (<PanelComponent>componentRef.instance).clickEmitter = this.clickEmitter;
    (<PanelComponent>componentRef.instance).item = this.item;

    this.item.containerComponent = this;
  }



  handleIf(itemSelection: ItemSelection) {
    let result = true;
    if (this.ngxGridboardService.options.mutexMinMaxIcons) {
      if (itemSelection === ItemSelection.Maximize && this.maximized) {
        result = false;
      } else if (itemSelection === ItemSelection.Minimize && !this.maximized) {
        result = false;
      }
    }
    return result;
  }

  setMaximizedSize() {
    if (this.ngxGridboardService.options.direction !== vertical) {
      this.height = this.ngxGridboardService.gridboard.height;
      this.width = this.ngxGridboardService.gridboard.width;
    } else {
      var offsetTop = this.ngxGridboardService.gridboard.grid.nativeElement.offsetTop;
      this.height = window.innerHeight-(this.ngxGridboardService.gridboard.gridContainerOffsetTop+this.ngxGridboardService.gridboard.gridOffsetTop)+
        (window.scrollY === undefined ? window.pageYOffset : window.scrollY);
      this.width = this.ngxGridboardService.gridboard.width;
    }
  }

  maximizeItem() {
    this.maximized = true;
    this.ngxGridboardService.maximizedItemContainerComponent = this;

    this.left = 0;
    this.top = 0;
    this.setMaximizedSize();
    this.emitResize();
  }

  minimizeItem() {
    this.maximized = false;
    this.ngxGridboardService.maximizedItemContainerComponent = undefined;
    this.item.state = ItemState.Stopped;
    this.left = this.leftVal;
    this.top = this.topVal;
    this.width = this.widthVal;
    this.height = this.heightVal;
    this.ngxGridboardService.gridboard.sizeColumns();
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

    //  this.setRect();
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
    } else {
      this.left = this.leftVal;
      this.top = this.topVal;
      this.width = this.widthVal;
      this.height = this.heightVal;
      this.emitResize();
    }
  }

  emitResize() {
    if (this.width && this.height) {
      this.resizeEmitter.emit({ w: this.width - this.ngxGridboardService.indentPx, h: this.height - this.ngxGridboardService.indentPx - this.ngxGridboardService.options.headerPx });
    }
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

    if (this.item.resizeType === 'se-resize-handle' ||
      this.item.resizeType === 'e-resize-handle' ||
      this.item.resizeType === 'ne-resize-handle') {
      this.width = width + this.moveDelta.x;
    }

    if (this.item.resizeType === 'w-resize-handle' ||
      this.item.resizeType === 'nw-resize-handle' ||
      this.item.resizeType === 'sw-resize-handle') {
      if (width - this.moveDelta.x < 0) {
        this.left = left - width;
        this.width = 0;
      } else {
        this.left = left + this.moveDelta.x;
        this.width = width - this.moveDelta.x;
      }
    }

    if (this.item.resizeType === 'se-resize-handle' ||
      this.item.resizeType === 's-resize-handle' ||
      this.item.resizeType === 'sw-resize-handle') {
      this.height = top + height + this.moveDelta.y;
    }

    if (this.item.resizeType === 'ne-resize-handle' ||
      this.item.resizeType === 'n-resize-handle' ||
      this.item.resizeType === 'nw-resize-handle') {
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
