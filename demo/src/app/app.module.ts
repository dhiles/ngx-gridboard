import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgxGridboardModule } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroJobAdComponent,
    HeroProfileComponent,
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    NgxGridboardModule,
  ],
  exports: [
    HeroJobAdComponent, HeroProfileComponent
  ],
  providers: [],
  entryComponents: [
    HeroJobAdComponent,
    HeroProfileComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
