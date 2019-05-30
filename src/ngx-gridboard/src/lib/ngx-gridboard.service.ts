import { Injectable, Renderer2, RendererFactory2, ElementRef } from "@angular/core";
import { Item, ItemMouseEvent } from './item';
import { NgxGridboardComponent } from './ngx-gridboard.component';

export const vertical = 'vertical';

@Injectable()
export class NgxGridboardService {
    options: any;
    cellWidth: number;
    cellHeight: number;
    fontSize: number;
    widthHeightRatio = 1;
    heightToFontSizeRatio;
    activeItem: Item;
    gridboard: NgxGridboardComponent;
    gridContainer: ElementRef;
    marginPx: number;
    borderPx: number;
    renderer: Renderer2;
    maximizedItem: Item;

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null)
    }

    deleteItem(item) {
        this.gridboard.deleteItem(item);
    }

    setStyles(styleName: string, classes: any) {
        for (let elementStyles in this.options.styles[styleName]) {
            let elementStyle = this.options.styles[styleName][elementStyles];
            if (this.options.styles[styleName][elementStyles]) {
                for (var style in elementStyle) {
                    var el = classes.find((aClass) => {
                        return aClass.nativeElement.className === elementStyles
                    });
                    this.renderer.setStyle(el.nativeElement, style, elementStyle[style]);
                }
            }
        }
    }

    get gridContainerWidth() {
        return (this.gridContainer && this.gridContainer.nativeElement) ?
            Math.max(this.gridContainer.nativeElement.clientWidth, this.gridContainer.nativeElement.innerWidth || 0) : 0;
    }

    get gridContainerHeight() {
        return (this.gridContainer && this.gridContainer.nativeElement) ?
            Math.max(this.gridContainer.nativeElement.clientHeight, this.gridContainer.nativeElement.innerHeight || 0) : 0;
    }

}