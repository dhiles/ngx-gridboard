import { ElementRef } from '@angular/core';
import { PanelItem } from './panel/panel-item';
import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-item-container.component';


export interface Coords {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Dimensions {
  x: number;
  y: number;
  w: number;
  h: number;
}

export enum ItemState {
  Stopped,
  Move,
  Resize,
  Maximize
}

export interface Item {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
    title?: string;
    description?: string;
    toolbarItems?: any;
    element: ElementRef;
    elementRef: ElementRef;
    panelItem: PanelItem;
    containerComponent: NgxGridboardItemContainerComponent;
    resizeType?: string;
    state: ItemState;
    gridContainerCoords?: Coords;
    mouseDownRelativeCoords?: Coords;
    tobeDeleted: boolean;
  }

  export interface ItemMouseEvent {
    event?: any;
    item: Item;
    pos?: Coords;
  }

  export enum ItemSelection {
    Close,
    Minimize,
    Maximize
  }

  


