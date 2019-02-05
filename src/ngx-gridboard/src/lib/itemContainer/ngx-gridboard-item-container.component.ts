import {
  Component, Input, Output, OnInit, ViewChild, ViewChildren, ComponentFactoryResolver,
  OnDestroy, EventEmitter, HostListener, ElementRef, Renderer2,
  QueryList, AfterViewInit, ContentChildren, AfterContentInit, forwardRef, KeyValueDiffers
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxGridboardService } from '../ngx-gridboard.service';
import { PanelItem } from '../panel/panel-item';
import { PanelDirective } from '../panel/panel.directive';
import { PanelComponent } from '../panel/panel.component';
import { Item, ItemState, ItemMouseEvent, Coords, Size, Dimensions } from '../item';
import { Class } from '../class.directive';

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
  @Output() resizeMouseDownEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();
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
  zIndex = 0;
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

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(true);
    this.enteredByMouse = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
    this.enteredByMouse = false;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.handleMouseDownEvent(event);
    this.setAbsPosition();
    this.pressStart = { x: event.pageX - (this.absPos.x), y: event.pageY - (this.absPos.y) };
    if (this.pressStart.y <= 40) {
      this.handleMouseDown({ x: event.pageX, y: event.pageY });
    }
    return false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    this.handleMouseMove({ x: event.pageX, y: event.pageY });
    return false;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    this.handleMouseUp({ x: event.pageX, y: event.pageY });
    return false;
  }

  @HostListener('press', ['$event'])
  onPress(e) {
    const left = this.item.x * this.ngxGridboardService.options.cellWidth;
    const top = this.item.y * this.ngxGridboardService.options.cellHeight;
    const width = this.item.w * this.ngxGridboardService.options.cellWidth;
    const height = this.item.h * this.ngxGridboardService.options.cellHeight;
    this.setAbsPosition();
    this.pressStart = { x: e.center.x - (this.absPos.x), y: e.center.y - (this.absPos.y) };

    if (this.pressStart.y > 40 && !this.enteredByMouse) {
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

  @HostListener('panstart', ['$event'])
  onHostPanStart(e) {
    if (this.inPress) {
      const pos = { x: e.center.x, y: e.center.y };
      this.handlePanStartEvent({ x: e.center.x, y: e.center.y });
    }
    return false;
  }

  onPanStart(e) {
    const pos = { x: e.center.x, y: e.center.y };
    this.handlePanStartEvent({ x: e.center.x, y: e.center.y });
    return false;
  }

  @HostListener('panmove', ['$event'])
  onPanMove(e) {
    if (this.inPress) {
      this.item.state = ItemState.Resize;
      this.inPress = false;
    }
    this.handleMouseMove({ x: e.center.x, y: e.center.y });
    return false;
  }

  @HostListener('panend', ['$event'])
  onPanEnd(e) {
    this.handleMouseUp({ x: e.center.x, y: e.center.y });
    return false;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public ngxGridboardService: NgxGridboardService,
    private keyValueDiffers: KeyValueDiffers
  ) {
    this.keyValueDiffer = keyValueDiffers.find({}).create();
    this.clickEmitter.subscribe( () => {
      this.deleteItem();
    });
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
      this.highlight(false);
    });

    this.layoutChangeEmitter.subscribe(() => {
      this.setRect()
    });

    this.highlight(null);
    this.setRect();
  }

  ngAfterViewInit() {
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

    this.zIndex = 1000;
    if (!(this.item.state === ItemState.Resize)) {
      this.item.state = ItemState.Move;
    }
    this.highlight(true);
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
    this.zIndex = 0;
    this.moveDelta = { x: 0, y: 0 };
    this.mouseUpEmitter.emit({ pos: pos, item: this.item });
  }

  private highlight(on: boolean) {
    if (on) {
      this.renderer.setStyle(this.outer.nativeElement, 'border', this.ngxGridboardService.options.borderPx + 'px solid ' + this.ngxGridboardService.options.highlightColor);
    } else {
      this.renderer.setStyle(this.outer.nativeElement, 'border', this.ngxGridboardService.options.borderPx + 'px solid transparent');
    }
  }

  itemResizeMouseDown(result: ItemMouseEvent) {
    this.item.state = ItemState.Resize;
    this.handleMouseDown(result.pos);
  }

  setRect() {
    this.left = this.leftVal;
    this.top = this.topVal;
    this.width = this.widthVal;
    this.height = this.heightVal;
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

  }

  deleteItem() {
    this.ngxGridboardService.deleteItem(this.item);
    this.ngxGridboardService.activeItem = null;
  }


}
