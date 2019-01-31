import { Component, Input, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.job-ad { background-color: green; height: 100%; overflow: auto;}'],
  template: `
     <div class="job-ad">
      <h4>{{data.headline}}</h4>
      <button (click)="handleClick()">Click me</button>

      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent implements PanelComponent {
  @Input() data: any;
  @Input() resizeEmitter: EventEmitter<any>;
  
  handleClick() {
    alert('clicked');
  }

  folderClicked() {
    alert('folder clicked');
  }

}

