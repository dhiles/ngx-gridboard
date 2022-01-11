import { Item, ItemSelection } from '../item';

export interface GridboardItemContainer {
    maximized: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
    item: Item;

    handleIf(itemSelection: ItemSelection)

}