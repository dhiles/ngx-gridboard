import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxGridboardComponent } from './ngx-gridboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'gridList', component: NgxGridboardComponent }
    ])
  ],
  exports: [RouterModule]
})
export class NgxGridboardRoutingModule { }
