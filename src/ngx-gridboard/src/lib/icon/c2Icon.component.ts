import { Component, Input } from '@angular/core';
import { NgxGridboardService } from '../ngx-gridboard.service';

//     <i [ngClass]="ngxGridboardService.options.styles.iconClass" [ngStyle]="getIconStyle()" (click)="handleClick()" [title]="toolbarItem.title" [attr.aria-label]="toolbarItem.ariaLabel">{{toolbarItem.iconClass}}</i>


export class C2IconComponent {

  @Input() toolbarItem: any;
  @Input() panelComponent: any;

  constructor(
    public ngxGridboardService: NgxGridboardService
  ) {
  }

  getIconStyle() {
    var mixStyle = {};
    Object.assign(mixStyle, this.ngxGridboardService.options.styles.icons, this.toolbarItem.iconStyle);
    return mixStyle;
  }

  getIconClass() {
    var funcAccess: any = this;
    var iconClass = '';
    if (funcAccess[this.toolbarItem.iconClassFunction]) {
      iconClass += funcAccess[this.toolbarItem.iconClassFunction]();
    }
    if (this.toolbarItem.iconClass) {
      iconClass += this.toolbarItem.iconClass;
    }
    //console.log('getIconClass: iconClass='+iconClass);
    return iconClass;
  }

  handleClick(toolbarItem: any) {
    if (this.panelComponent[toolbarItem.clickFunction]) {
      this.panelComponent[toolbarItem.clickFunction]();
    }
    else {
      var funcAccess: any = this;
      if (funcAccess[toolbarItem.clickFunction]) {
        funcAccess[toolbarItem.clickFunction]();
      } 
    }
  }




}