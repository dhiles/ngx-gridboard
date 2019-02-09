import { Component, Input, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.hero-profile { background-color: yellow; height: 100%; overflow: auto;}'],
  template: `
    <ng-template #iconTemplate let-toolbarItem='toolbarItem'>
      <i class="material-icons header-icon" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick(toolbarItem)">{{ toolbarItem.iconClass }}</i>
    </ng-template>

    <div class="hero-profile">
      <h3>Featured Hero Profile</h3>
      <h4>{{data.name}}</h4>

      <p>{{data.bio}}</p>

      <strong>Hire this hero today!</strong>
    </div>
  `
})
export class HeroProfileComponent extends PanelComponent {
  publishClicked() {
    alert('publish clicked');
  }

}


