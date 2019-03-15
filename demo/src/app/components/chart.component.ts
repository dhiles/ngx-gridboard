import { Component, Input, Renderer2, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.hero-profile { background-color: orange; height: 100%; overflow: auto;}'],
  template: `
  <ng-template #iconTemplate let-toolbarItem='toolbarItem'>
    <i class="material-icons" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick(toolbarItem)" title="{{toolbarItem.title}}">{{ toolbarItem.iconClass }}</i>
  </ng-template>
  
  <google-chart
    [title]="title"
    [type]="type"
    [data]="chartData"
    [columnNames]="columnNames"
    [options]="options"
    [width]="resizeWidth"
    [height]="resizeHeight"
    >
  </google-chart>
  `
})
export class ChartComponent extends PanelComponent implements OnInit {
  chartData: Array<Array<any>>;
  columnNames: Array<string>;
  options: any;
  title: string;
  type: string;
  resizeWidth = 50;
  resizeHeight = 50;


  constructor(private renderer: Renderer2, public elementRef: ElementRef) {
    super(elementRef); 
  }

  ngOnInit() {
    this.loadChart();
    this.resizeEmitter.subscribe((size) => {
      this.handleResize(size.w,size.h);
    })
  }

  loadChart() {
    this.type = 'PieChart';
    this.columnNames = ['Topping', 'Slices'];
    this.chartData = [
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ];

    this.title = 'How Much Pizza I Ate Last Night';

    this.options = {
    };

  }

  handleResize(width, height) {
    this.resizeWidth = width;
    this.resizeHeight = height;
  }
}


