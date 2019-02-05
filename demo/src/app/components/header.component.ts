import { Component } from '@angular/core';

@Component({
  selector: 'gb-header',  
   template: `
    <div class="header" #header>
        <ng-content></ng-content>
    </div> 
`
})
export class HeaderComponent {
}

