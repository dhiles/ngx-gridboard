
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, BREAKPOINT } from '@angular/flex-layout';


import { NgxGridboardComponent } from './ngx-gridboard.component';
import { NgxGridboardRoutingModule } from './ngx-gridboard-routing.module';
import { ResizeDirective } from './resize.directive';
import { ResizeService } from './resize.service';
import { Class } from './class.directive';
import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-item-container.component';
import { HeaderIconsComponent } from './itemContainer/headerIcons.component';
import { NgxGridboardService } from './ngx-gridboard.service';
import { PanelModule } from './panel/panel.module';
import { PanelComponent } from './panel/panel.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'pan': { direction: Hammer.DIRECTION_ALL }
  }
}

const CUSTOM_BREAKPOINTS = [
/*  {
    alias: "xs",
    suffix: "xs",
    mediaQuery: "screen and (max-width: 470px)",
    overlapping: false
  },
  {
    alias: "sm",
    suffix: "sm",
    mediaQuery: "screen and (min-width: 471px) and (max-width: 767px)",
    overlapping: false
  },
  {
    alias: "md",
    suffix: "md",
    mediaQuery: "screen and (min-width: 768px) and (max-width: 991px)",
    overlapping: false
  },
  {
    alias: "lg",
    suffix: "lg",
    mediaQuery: "screen and (min-width: 992px) and (max-width: 1199px)",
    overlapping: false
  },
  {
    alias: "xl",
    suffix: "xl",
    mediaQuery: "screen and (min-width: 1200px) and (max-width: 5000px)",
    overlapping: false
  }, */
  {
    alias: "lt-sm",
    suffix: "lt-sm",
    mediaQuery: "screen and (max-width: 470px)",
    overlapping: false
  },
  {
    alias: "lt-md",
    suffix: "lt-md",
    mediaQuery: "screen and (max-width: 767px)",
    overlapping: false
  },
  {
    alias: "lt-lg",
    suffix: "lt-lg",
    mediaQuery: "screen and (max-width: 991px)",
    overlapping: false
  },
  {
    alias: "lt-xl",
    suffix: "lt-xl",
    mediaQuery: "screen and (max-width: 1199px)",
    overlapping: false
  }
];

@NgModule({
  imports: [NgxGridboardRoutingModule,
    CommonModule,
    PanelModule,
    FlexLayoutModule
  ],
  declarations: [
    NgxGridboardComponent,
    PanelComponent,
    HeaderIconsComponent,
    ResizeDirective,
    NgxGridboardItemContainerComponent,
    Class
  ],
  providers: [
    ResizeService,
    NgxGridboardService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    // register a Custom BREAKPOINT Provider
    {
      provide: BREAKPOINT,
      useValue: CUSTOM_BREAKPOINTS,
      multi: true
    }

    //HAMMER_GESTURE_CONFIG  
  ],
  exports: [
    NgxGridboardComponent,
    NgxGridboardItemContainerComponent
  ]
})
export class NgxGridboardModule { }
