import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { ItemSelection } from '../item';
import { NgxGridboardService } from '../ngx-gridboard.service';

@Component({
  selector: 'gb-header',  
   template: `
        <div [ngStyle]="ngxGridboardService.options.styles.gridItemContainer.headerIcons">
            <ng-container *ngFor="let toolbarItem of panelComponent.item.toolbarItems">
                <ng-container *ngIf="panelComponent.handleIf(panelComponent.item)">
                    <ng-container *ngIf="panelComponent.iconTemplate">
                        <ng-container [ngTemplateOutlet]="panelComponent.iconTemplate" [ngTemplateOutletContext]="{toolbarItem:toolbarItem}"></ng-container>
                    </ng-container>
                </ng-container>
            </ng-container>
        </div>
`
})
export class HeaderComponent {
    @Input() panelComponent: PanelComponent;
    @Input() template;
    @Output() someEvent = new EventEmitter();
    ItemSelection: typeof ItemSelection = ItemSelection; // access enum from template

    constructor(public ngxGridboardService: NgxGridboardService) {
        console.log('header constructor');
    }

}