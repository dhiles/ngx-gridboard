import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PanelComponent } from './panel.component';
import { PanelDirective } from './panel.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PanelDirective,
   // PanelComponent
  ],
  exports: [
    PanelDirective,
   // PanelComponent
  ],
  providers: [
  ]
})
export class PanelModule { }
