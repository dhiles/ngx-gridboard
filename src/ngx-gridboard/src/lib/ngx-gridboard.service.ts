import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Item, ItemMouseEvent } from './item';
import { NgxGridboardComponent } from './ngx-gridboard.component';

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
    marginPx: number;
    borderPx: number;
    renderer: Renderer2;

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

}