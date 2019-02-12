import { Component, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Size, ItemSelection, Item } from '../item';

declare type deleteHandler = () => void;

@Component({
  selector: 'gb-panel',
  template: ''
})
export class PanelComponent implements AfterViewInit{
  @ViewChild('iconTemplate') iconTemplate; 
  data: any;
  resizeEmitter: EventEmitter<Size>;
  clickEmitter: EventEmitter<any>;
  item: Item;
  toolbarItem: any;
   
  constructor() {   
  }

  ngAfterViewInit() {
    if (this.iconTemplate) {
      console.log(this.iconTemplate);
    }
  }

  handleItemSelection(selection: ItemSelection) {
    this.clickEmitter.next(selection);
  }

  handleIf(toolbarItem: any) {
    var result = true;
    if (toolbarItem.ifFunction && this[toolbarItem.ifFunction]) {
      result = this[toolbarItem.ifFunction]();
    }
    return result;
  }

  handleClick(toolbarItem: any) {
    if (this[toolbarItem.clickFunction]) {
      this[toolbarItem.clickFunction]();
    }
    else {
      var funcAccess: any = this;
      if (funcAccess[toolbarItem.clickFunction]) {
        funcAccess[toolbarItem.clickFunction]();
      } else if (toolbarItem.itemSelection !== undefined) {
          this.clickEmitter.next(toolbarItem.itemSelection);
      }
    }
  }

  getIconClass(toolbarItem: any) {
    var funcAccess: any = this;
    var iconClass = '';
    if (funcAccess[toolbarItem.iconClassFunction]) {
      iconClass += funcAccess[toolbarItem.iconClassFunction]();
    }
    if (toolbarItem.iconClass) {
      iconClass += toolbarItem.iconClass;
    }
    //console.log('getIconClass: iconClass='+iconClass);
    return iconClass;
  }



}

