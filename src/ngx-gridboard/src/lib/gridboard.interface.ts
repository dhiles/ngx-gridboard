import { ElementRef } from '@angular/core';
import { Item } from './item';

export interface Gridboard {
    gridList: any;
    width: number;
    height: number;
    gridOffsetTop: number;
    gridContainerOffsetTop: number;
    grid: ElementRef;

    deleteItem(item: Item)
    sizeColumns()
}