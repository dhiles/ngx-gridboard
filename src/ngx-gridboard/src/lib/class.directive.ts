import { Directive, HostBinding, Input } from '@angular/core';

@Directive({selector: '[class]'})
export class Class  { 
  @HostBinding('class') @Input('class') className: string = '';    
}



