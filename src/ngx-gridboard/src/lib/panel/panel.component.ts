import { Component, EventEmitter } from '@angular/core';
import { Size } from '../item';
import { NgxGridboardService } from '../ngx-gridboard.service';

declare type deleteHandler = () => void;

@Component({
  selector: 'gb-panel',
  template: ''
})
export class PanelComponent {
  data: any;
  resizeEmitter: EventEmitter<Size>;
  clickEmitter: EventEmitter<any>; 
  
  constructor() {   
  }

  deleteItem() {
    this.clickEmitter.next();
  }
}

