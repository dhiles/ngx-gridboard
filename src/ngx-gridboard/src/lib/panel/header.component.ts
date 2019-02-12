import { Component, Input } from '@angular/core';
import { PanelComponent } from './panel.component';
import { ItemSelection } from '../item';
import { NgxGridboardService } from '../ngx-gridboard.service';

@Component({
  selector: 'gb-header',  
   template: `
    <div [ngStyle]="ngxGridboardService.options.styles.gridItemContainer.header" [style.height.px]="ngxGridboardService.options.headerPx" #header>
        <div [ngStyle]="ngxGridboardService.options.styles.gridItemContainer.title" #title >{{ panel.item.title }}</div>
        <div [ngStyle]="ngxGridboardService.options.styles.gridItemContainer.headerIcons">
            <ng-container *ngFor="let toolbarItem of panel.item.toolbarItems">
                <ng-container *ngIf="panel.handleIf(panel.item)">
                    <ng-container *ngIf="template">
                        <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{toolbarItem:toolbarItem}"></ng-container>
                    </ng-container>
                </ng-container>
            </ng-container>
        </div>
    </div> 
`
})
export class HeaderComponent {
    @Input() panel: PanelComponent;
    @Input() template;
    ItemSelection: typeof ItemSelection = ItemSelection; // access enum from template

    constructor(public ngxGridboardService: NgxGridboardService) {
    }

}