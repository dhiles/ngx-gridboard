import { Component, Input, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.job-ad { background-color: green; height: 100%; overflow: auto;}'],
  template: `
  <ng-template #iconTemplate let-toolbarItem='toolbarItem'>
    <i class="material-icons header-icon" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick(toolbarItem)">{{ toolbarItem.iconClass }}</i>
  </ng-template>
  <div class="job-ad">
      <h4>{{data.headline}}</h4>
      <button (click)="handleClick(toolbarItem)">Click me</button>

      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent extends PanelComponent {
  handleClick(toolbarItem: any) {
    alert('clicked');
    super.handleClick(toolbarItem);
  }

}

