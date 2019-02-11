import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelDirective } from './panel.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PanelDirective
  ],
  exports: [
    PanelDirective
  ],
  providers: [
  ]
})
export class PanelModule { }
