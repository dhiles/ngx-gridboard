import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[gbPanelHost]',
})
export class PanelDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

