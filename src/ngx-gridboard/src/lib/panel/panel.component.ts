import { Component, EventEmitter, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs'
import { Size, ItemSelection, Item, Layout } from '../item';

declare type deleteHandler = () => void;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gb-panel',
  template: ''
})
export class PanelComponent implements AfterViewInit {
  @ViewChild('iconTemplate', { static: true }) iconTemplate;
  data: any;
  resizeEmitter: EventEmitter<Size>;
  layout$: ReplaySubject<Layout>
  clickEmitter: EventEmitter<any>;
  item: Item;
  toolbarItem: any;

  constructor(public elementRef: ElementRef) {
  }

  ngAfterViewInit() {
  }

  handleItemSelection(selection: ItemSelection) {
    this.clickEmitter.next(selection);
  }

  handleIf(toolbarItem: any) {
    var result = true;
    if (toolbarItem.ifFunction && this[toolbarItem.ifFunction]) {
      result = this[toolbarItem.ifFunction]();
    } else {
      if (toolbarItem.itemSelection) {
        result = this.item.containerComponent.handleIf(toolbarItem.itemSelection);
      }
    }

    return result;
  }

  handleClick(event: any, toolbarItem: any) {
    if (toolbarItem) {
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
    return iconClass;
  }



}

