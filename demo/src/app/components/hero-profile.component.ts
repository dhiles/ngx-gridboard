import { Component, Input, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.hero-profile { background-color: yellow; height: 100%; overflow: auto;}'],
  template: 
   `
    <gb-header>
      <div class="title" #title >title1</div>
      <div class="close" (click)="deleteItem()"></div>
    </gb-header>
    <div class="hero-profile">
      <h3>Featured Hero Profile</h3>
      <h4>{{data.name}}</h4>

      <p>{{data.bio}}</p>

      <strong>Hire this hero today!</strong>
    </div>
  `
})
export class HeroProfileComponent extends PanelComponent {
}


