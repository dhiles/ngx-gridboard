import { Component, EventEmitter } from '@angular/core';
import { PanelItem, LaneChange, NgxGridboardService, ItemSelection } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';
import { ChartComponent } from './components/chart.component';
import { Observable, Subject, fromEvent, of } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'the ngx-gridboard 1.1.13 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();
  itemUpdateEmitter: EventEmitter<any> = new EventEmitter<any>();

  options = {
    fixedLanes: 0,
    mediaQueryLanes: {
      xl: 5,
      'lt-xl': 5,
      lg: 4,
      'lt-lg': 4,
      md: 3,
      'lt-md': 3,
      sm: 2,
      'lt-sm': 2,
      xs: 1
    },
    responsiveBreakpointsX: {
      sm: 500,
      xs: 200
    },
    gridContainer: {
      widthx: 2000,
      heightx: 500
    },
    direction: 'vertical',
    highlightColor: 'black',
    marginPx: 10,
    borderPx: 2,
    headerPx: 40,
    mutexMinMaxIcons: true,
    styles: {
      gridContainer: {
        'grid-container': {
          'background-color': 'rgb(171, 171, 196)'
        },
        'position-highlight': {
          color: 'blue'
        }
      },
      gridItemContainer: {
        header: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'background': '#fff',
          'border-bottom': '1px solid #bbb',
          top: '0px',
          left: '0px',
          right: '0px',
          'z-index': 1,
          cursor: 'move'
        },
        title: {
          color: 'green',
          flex: 1
        },
        'headerIcons': {
          color: 'black',
          flex: 1,
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          cursor: 'pointer',
          'margin-right': '10px'
        }
      }
    }
  };


  items = [
    {
      id: 0,
      title: 'Pizza Chart',
      description: 'types of pizza eaten',
      toolbarItems: [
        {
          title: 'maximize',
          ariaLabel: 'maximize',
          itemSelection: ItemSelection.Maximize,
          iconClass: 'maximize'
        },
        {
          title: 'minimize',
          ariaLabel: 'minimize',
          itemSelection: ItemSelection.Minimize,
          iconClass: 'minimize'
        },
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
        }
      ],
      w: 1, h: 1, x: 3, y: 0, panelItem: new PanelItem(ChartComponent, {
      })
    },
    {
      id: 1,
      title: 'Hero Profile',
      description: 'hero info',
      toolbarItems: [
        {
          title: 'publish',
          ariaLabel: 'publish',
          clickFunction: 'publishClicked',
          ifFunction: 'isAuthenticated',
          iconClass: 'publish',
          iconStyle: { 'color': 'pink' },
        },
        {
          title: 'maximize',
          ariaLabel: 'maximize',
          itemSelection: ItemSelection.Maximize,
          iconClass: 'maximize'
        },
        {
          title: 'minimize',
          ariaLabel: 'minimize',
          itemSelection: ItemSelection.Minimize,
          iconClass: 'minimize',
          ifFunction: 'isMaximized',
        },
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
        }
      ], w: 1, h: 1, x: 0, y: 0,
      panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' })
    },
    {
      id: 2,
      title: 'Job Ad',
      description: 'find a job',
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close',
          iconStyle: { 'color': 'blue' },
        }
      ],
      w: 1, h: 1, x: 1, y: 0, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'Openings in all departments',
        body: 'Apply today'
      })
    }
  ];

  decrementLanes() {
    if (this.options.fixedLanes > 1) {
      this.options.fixedLanes -= 1;
    }
  }

  incrementLanes() {
    this.options.fixedLanes += 1;
  }

  onLaneChange(event: LaneChange) {
    this.laneChanges.next(event);
  }

  addItem() {
    const item = {
      id: 0, title: 'Job Ad1',
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
        }
      ],
      w: 1, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'adding',
        body: 'New Item!'
      })
    };
    // this.items.push(item);
    this.itemUpdateEmitter.emit({
      operation: "add",
      lanePosition: "last",
      item: item
    });

  }

  removeFirstItem() {
    if (this.items.length) {
      //this.items[0].panelItem.gridboardItem.deleteItem();
    }
  }

}

