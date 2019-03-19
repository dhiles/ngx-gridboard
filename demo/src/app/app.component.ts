import { Component } from '@angular/core';
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
  title = 'the ngx-gridboard 1.1.9 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();

  options = {
    fixedLanes: 5,
    mediaQueryLanes: {
      xl: 5,
      'lt-xl': 4, 
      lg: 4,
      'lt-lg': 3, 
      md: 3,
      'lt-md': 2, 
      sm: 2,
      'lt-sm': 1,
      xs: 1
    },
    direction: 'vertical',
    highlightColor: 'black',
    marginPx: 10,
    borderPx: 2,
    headerPx: 40,
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
          flex: 1,
          'text-align': 'center'      
        },
        'headerIcons': {
          color: 'black',
          'margin-left': 'auto',
          cursor: 'pointer',
          'margin-right': '5px', 
          display: 'flex', 
          'justify-content': 'center', 
          'align-items': 'center'                
        }
      }
    }
  };


  items = [
    {
      id: 0, title: 'Pizza Chart', 
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
        }
      ],
      w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
      })
    },
    {
      id: 1, title: 'Hero Profile', 
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
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
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
          iconClass: 'minimize'
        }
      ],w: 1, h: 1, x: 0, y: 0,
      panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' })
    },
    {
      id: 2, title: 'Job Ad',
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close',
          iconStyle: { 'color': 'blue' },
        }
      ],
      w: 1, h: 1, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'Openings in all departments',
        body: 'Apply today'
      })
    }
  ];

  getItems() {
    this.items.forEach(function (item) {
      console.log(item);
    });
  }

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
      id: 0, title: 'Job Ad',
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          itemSelection: ItemSelection.Close,
          iconClass: 'close'
        }
      ], 
      w: 1, h: 1, x: 1, y: 0, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'adding',
        body: 'New Item!'
      })
    };
    this.items.push(item);
  }

  removeFirstItem() {
    if (this.items.length) {
      //this.items[0].panelItem.gridboardItem.deleteItem();
    }
  }

}

