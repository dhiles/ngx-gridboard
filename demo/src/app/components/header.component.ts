import { Component, Input } from '@angular/core';
import { PanelComponent, ItemSelection } from 'ngx-gridboard';

@Component({
  selector: 'gb-header',  
   template: `
    <div class="header" #header>
        <div class="title" #title >title1</div>
        <div class="header-icons">
            <div *ngFor="let toolbarItem of parent.item.toolbarItems">
                <span *ngIf="parent.handleIf(parent.item)">
                    <i class="material-icons" (click)="parent.handleClick(toolbarItem)">{{ parent.getIconClass(toolbarItem) }}</i>
                </span>
            </div>
        </div>
    </div> 
`
})
export class HeaderComponent {
    @Input() parent: PanelComponent;
    ItemSelection: typeof ItemSelection = ItemSelection; // access enum from template

}