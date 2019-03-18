import { Component, Input, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.job-ad { background-color: green; height: 100%; overflow: auto;}'],
  template: `
  <ng-template #iconTemplate let-toolbarItem='toolbarItem'>
    <i class="material-icons" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick($event,toolbarItem)" title="{{toolbarItem.title}}">{{ toolbarItem.iconClass }}</i>
  </ng-template>
  <div class="job-ad">
      <h4>{{data.headline}}</h4>
      <button (click)="handleClick($event,toolbarItem)">Click me</button>

      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent extends PanelComponent {
  handleClick(event: any,toolbarItem: any) {
    alert('clicked');
    super.handleClick(event,toolbarItem);
  }

}

