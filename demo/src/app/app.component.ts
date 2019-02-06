import { Component } from '@angular/core';
import { PanelItem, LaneChange, NgxGridboardService } from 'ngx-gridboard';
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
  title = 'the ngx-gridboard 1.1.7 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();

  options = {
    fixedLanes: 5,
    mediaQueryLanes: {
      xl: 5,
      lg: 4,
      md: 3,
      sm: 2,
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
          margin: '0 10px'
        },
        title: {
          color: 'green',
          float: 'left'
        }
      },
      items: {'display': 'flex', 'justify-content': 'center', 'align-items': 'center'},
      iconClass: 'material-icons',
      icons: {'cursor':'pointer', 'color': 'black'}
    }
  };


  items = [
    {
      id: 0,
      title: 'Pizza Chart',
      titleStyle: { 'flex': '1', 'text-align': 'center'},
      itemStyle: {'background-color':'green'},
      toolbarItems: [
        {
          title: 'close',
          ariaLabel: 'close',
          clickFunction: 'deleteItem',
          ifFunction: 'isAuthenticated',
          iconClass: 'close'
        }
      ],
      w: 1, h: 1, x: 1, y: 0,
      panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
      })
    },
    {
      id: 1, 
      title: 'Hero Profile',
      titleStyle: {'color':'orange',  'flex': '1', 'text-align': 'center'},
      iconsStyle: {'color':'black', 'margin-left': 'auto', 'align-self': 'center'},
      toolbarItems: [
        {
          title: 'publish',
          ariaLabel: 'publish',
          clickFunction: 'publishClicked',
          ifFunction: 'isAuthenticated',
          iconClass: 'publish',
          iconStyle: {'color':'pink'},
        },
        {
          title: 'close',
          ariaLabel: 'close',
          clickFunction: 'deleteItem',
          ifFunction: 'isAuthenticated',
          iconClass: 'close',
          iconStyle: {'color':'blue'},
        }
      ],
      w: 1, h: 1, x: 0, y: 0,
      panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' })
    },
    {
      id: 2, 
      title: 'Job Ad',
      titleStyle: {'color':'LightGray', 'margin-left': '10px'},
      itemStyle: {'color':'yellow','background-color':'purple','justify-content': 'left'},
      iconsStyle: {'color':'black', 'margin-left': 'auto', 'align-self': 'center'},
      toolbarItems: [
        {
          title: 'fullscreen',
          ariaLabel: 'close',
          clickFunction: 'folderClicked',
          ifFunction: 'isAuthenticated',
          iconClass: 'folder',
        },
        {
          title: 'close',
          ariaLabel: 'close',
          clickFunction: 'deleteItem',
          ifFunction: 'isAuthenticated',
          iconClass: 'close'
        }
      ],
      w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
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
    const item =     {
      id: 2, 
      title: 'Job Ad',
      titleStyle: {'color':'LightGray', 'margin-left': '10px'},
      itemStyle: {'color':'yellow','background-color':'purple','justify-content': 'left'},
      iconsStyle: {'color':'black', 'margin-left': 'auto', 'align-self': 'center'},
      toolbarItems: [
        {
          title: 'fullscreen',
          ariaLabel: 'close',
          clickFunction: 'folderClicked',
          ifFunction: 'isAuthenticated',
          iconClass: 'folder',
        },
        {
          title: 'close',
          ariaLabel: 'close',
          clickFunction: 'deleteItem',
          ifFunction: 'isAuthenticated',
          iconClass: 'close'
        }
      ],
      w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'Openings in all departments',
        body: 'Apply today'
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

