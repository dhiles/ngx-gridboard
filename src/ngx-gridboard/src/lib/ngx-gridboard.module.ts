
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxGridboardComponent } from './ngx-gridboard.component';
import { NgxGridboardRoutingModule } from './ngx-gridboard-routing.module';
import { ResizeDirective } from './resize.directive';
import { Class } from './class.directive';
import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-item-container.component';
import { NgxGridboardService } from './ngx-gridboard.service';
import { PanelModule } from './panel/panel.module';
import { HeaderComponent } from './panel/header.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration
      'pan': { direction: Hammer.DIRECTION_ALL  }      
  }
}


@NgModule({
  imports: [NgxGridboardRoutingModule,
    CommonModule,
    PanelModule,
    FlexLayoutModule
  ],
  declarations: [
    NgxGridboardComponent,
    HeaderComponent,
    ResizeDirective,
    NgxGridboardItemContainerComponent,
    Class
  ],
  providers: [
    NgxGridboardService,
    { 
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: MyHammerConfig 
    }
    
    //HAMMER_GESTURE_CONFIG  
  ],
  exports: [
    NgxGridboardComponent,
    HeaderComponent,
    NgxGridboardItemContainerComponent
  ]
})
export class NgxGridboardModule { }
