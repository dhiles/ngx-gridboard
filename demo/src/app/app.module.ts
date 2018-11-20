import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxGridboardModule } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';
import { ChartComponent } from './components/chart.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [
    AppComponent,
    HeroJobAdComponent,
    HeroProfileComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule, 
    NgxGridboardModule,
    GoogleChartsModule
  ],
  exports: [
    HeroJobAdComponent, HeroProfileComponent
  ],
  providers: [],
  entryComponents: [
    HeroJobAdComponent,
    HeroProfileComponent,
    ChartComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
