import { Component, Input } from '@angular/core';
import { PanelComponent, ItemSelection } from 'ngx-gridboard';

@Component({
  selector: 'gb-header',  
   template: `
    <div class="header" #header>
        <div class="title" #title >{{ parent.item.title }}</div>
        <div class="header-icons">
            <ng-container *ngFor="let toolbarItem of parent.item.toolbarItems">
                <ng-container *ngIf="parent.handleIf(parent.item)">
                    <i class="material-icons header-icon" (click)="parent.handleClick(toolbarItem)">{{ parent.getIconClass(toolbarItem) }}</i>
                </ng-container>
            </ng-container>
        </div>
    </div> 
`
})
export class HeaderComponent {
    @Input() parent: PanelComponent;
    ItemSelection: typeof ItemSelection = ItemSelection; // access enum from template

}