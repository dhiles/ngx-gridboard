import { Component, EventEmitter } from '@angular/core';
import { PanelItem, LaneChange, NgxGridboardService, ItemSelection, ItemUpdateEvent } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';
import { Observable, Subject, fromEvent, of } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  xPos: number = 0
  yPos: number = 0
  title = 'the ngx-gridboard 1.1.20 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();
  itemUpdateEmitter: EventEmitter<ItemUpdateEvent> = new EventEmitter<ItemUpdateEvent>();

  get laneArrangement() {
    return this.options.direction === 'vertical' ? 'column' : 'row' 
  }

  options = {
    fixedLanes: 2,
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
    direction: 'vertical',
    highlightColor: 'pink',
    marginPx: 5,
    borderPx: 2,
    headerPx: 40,
    mutexMinMaxIcons: true,
    styles: {
      gridContainer: {
        'grid-container': {
          'background-color': 'rgb(171, 171, 196)'
        },
      },
      positionHighlight: {
        'position-highlight': {
          color: 'blue',
          'border-style': 'dotted'
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

  addLastItem() {
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

  addItem() {
    const item = {
      id: 0, title: 'Job Ad2',
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
        body: 'New Item at position ('+this.xPos+','+this.yPos+')!'
      })
    };
    // this.items.push(item);
    this.itemUpdateEmitter.emit({
      operation: "add",
      position: { x: this.xPos, y: this.yPos },
      item: item
    });

  }



  removeItem() {
    this.itemUpdateEmitter.emit({
      operation: "remove",
      position: { x: this.xPos, y: this.yPos },
    });

  }

}

