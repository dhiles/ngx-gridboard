import { Injectable, Renderer2, RendererFactory2, ElementRef } from "@angular/core";
import { Item, ItemMouseEvent } from './item';
import { GridboardItemContainer } from './itemContainer/gridboard-item-container.interface';
import { Gridboard } from './gridboard.interface';

// import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-item-container.component';

export const vertical = 'vertical';
const responsiveBreakpoints = {
    xs: 600,
    sm: 960,
    md: 1280,
    lg: 1920,
};

@Injectable()
export class NgxGridboardService {
    _options: any;
    get options() {
        return this._options
    }
    set options(val) {
        this._options = val
        this.indentPx = ((this._options.marginPx + this._options.borderPx + 3) * 2);
    }
    cellWidth: number;
    cellHeight: number;
    fontSize: number;
    widthHeightRatio = 1;
    heightToFontSizeRatio;
    activeItem: Item;
    // gridboard: NgxGridboardComponent;
    gridboard: Gridboard;
    gridContainer: ElementRef;
    marginPx: number;
    borderPx: number;
    renderer: Renderer2;
    maximizedItemContainerComponent: GridboardItemContainer;
    indentPx: number

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null)

    }

    deleteItem(item) {
        this.gridboard.deleteItem(item);
    }

    setAllStyles(classes: any) {
        for (let styleName in this.options.styles) {
            this.setStyles(styleName,classes)
        }
    }

    setStyles(styleName: string, classes: any) {
        for (let elementStyles in this.options.styles[styleName]) {
            let elementStyle = this.options.styles[styleName][elementStyles];
            if (this.options.styles[styleName][elementStyles]) {
                for (var style in elementStyle) {
                    var el = classes.find((aClass) => {
                        return (aClass.nativeElement.className.indexOf(elementStyles) !== -1)
                    });
                    if (el) {
                        this.renderer.setStyle(el.nativeElement, style, elementStyle[style]);
                    }
                }
            }
        }
    }

    getMqBreakpoint(width) {
        let mq = 'xl';
        if (width < ((this.options.responsiveBreakpoints && this.options.responsiveBreakpoints.xs) ? 
            this.options.responsiveBreakpoints.xs : responsiveBreakpoints.xs)) {
          mq = 'xs';
        } else if (width < ((this.options.responsiveBreakpoints && this.options.responsiveBreakpoints.sm) ? 
            this.options.responsiveBreakpoints.sm : responsiveBreakpoints.sm)) {
          mq = 'sm';
        } else if ((width < this.options.responsiveBreakpoints && this.options.responsiveBreakpoints.md ? 
            this.options.responsiveBreakpoints.md : responsiveBreakpoints.md)) {
          mq = 'md';
        } else if ((width < this.options.responsiveBreakpoints && this.options.responsiveBreakpoints.lg ? 
            this.options.responsiveBreakpoints.lg : responsiveBreakpoints.lg)) {
          mq = 'lg';
        }
        return mq;
      }
    
    

}