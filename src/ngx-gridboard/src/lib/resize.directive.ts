import { Directive, ElementRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Item, ItemState, ItemMouseEvent } from './item';

@Directive({
  selector: '[gbResize]'
})
export class ResizeDirective {
  @Input() resizeType: string;
  @Input() item: Item;
  @Output() mouseDownEmitter: EventEmitter<ItemMouseEvent> = new EventEmitter<any>();

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
      this.item.state = ItemState.Resize;
      this.item.resizeType = this.resizeType;
      this.mouseDownEmitter.emit({event: event, pos: {x:event.pageX,y:event.pageY}, item: this.item});
  }
  constructor(private el: ElementRef) { }

}


