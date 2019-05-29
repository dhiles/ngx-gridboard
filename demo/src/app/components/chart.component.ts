import { Component, Input, Renderer2, ElementRef, OnInit, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

@Component({
  styles: ['.chart-container {padding: 20px;background-color: lime;}'],
  template: `
  <ng-template #iconTemplate let-toolbarItem='toolbarItem'>
    <i class="material-icons" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick($event,toolbarItem)" title="{{toolbarItem.title}}">{{ toolbarItem.iconClass }}</i>
  </ng-template>
  <div class="chart-container">
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
  <div>
  `
})
export class ChartComponent extends PanelComponent implements OnInit {
  chartData: Array<Array<any>>;
  columnNames: Array<string>;
  options: any;
  title: string;
  type: string;
  resizeWidth: number;
  resizeHeight: number;


  constructor(private renderer: Renderer2, public elementRef: ElementRef,private cd: ChangeDetectorRef) {
    super(elementRef); 
  }

  ngOnInit() {
    this.loadChart();
    this.resizeEmitter.subscribe((size) => {
      this.handleResize(size.w,size.h);
      this.cd.detectChanges();
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
    this.resizeWidth = width-40;
    this.resizeHeight = height-40;
  }
}


