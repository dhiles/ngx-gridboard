import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { ItemSelection } from '../item';
import { NgxGridboardService } from '../ngx-gridboard.service';

@Component({
  selector: 'gb-header-icons',  
   template: `
        <div [ngStyle]="ngxGridboardService.options.styles.gridItemContainer.headerIcons">
            <ng-container *ngFor="let toolbarItem of panelComponent.item.toolbarItems">
                <ng-container *ngIf="panelComponent.handleIf(toolbarItem)">
                    <ng-container *ngIf="panelComponent.iconTemplate">
                        <ng-container [ngTemplateOutlet]="panelComponent.iconTemplate" [ngTemplateOutletContext]="{toolbarItem:toolbarItem}"></ng-container>
                    </ng-container>
                </ng-container>
            </ng-container>
        </div>
`,
  styleUrls: ['./headerIcons.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderIconsComponent {
    @Input() panelComponent: PanelComponent;
    @Input() template;
    @Output() someEvent = new EventEmitter();
    ItemSelection: typeof ItemSelection = ItemSelection; // access enum from template

    constructor(public ngxGridboardService: NgxGridboardService) {
        // header constructor
    }

}