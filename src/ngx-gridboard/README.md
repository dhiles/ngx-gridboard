# ngx-gridboard

ngx-gridboard is an angular grid component which contains movable resizable panels each of which contains a component. The grid is built from a layout definition which specifies for each panel a component class and initial position and dimensions.   

## Installation

npm install ngx-gridboard --save

## Usage

### Default usage

<gb-gridboard [items]="items" [options]="options"></gb-gridboard>

### Which expects a setup like the following:

#### options: fields for mediaQuery lanes are optional. When defined, lanes will be set to the current media query size. If mediaQueryLanes is undefined, the value for fixedLanes is used. 
### items: PanelItems are created with a component and a data parameter. PanelItem Components are added to the entryComponents section of the calling module (see the demo code for an example). 

```javascript
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
      }
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

```
## Online Demo
http://www.seatoskysoft.com/ngx-gridboard-demo/

## Source code
https://github.com/dhiles/ngx-gridboard

## run demo
git clone https://github.com/dhiles/ngx-gridboard  
cd ngx-gridboard  
npm install  
npm run demo  

## release info
### 1.1.3
- added gestures for mobile sensitive devices. Touch gesture triggers a pan which allows for repositioning of grid items. Press followed by a pan gesture allows resizing of grid items.

### 1.1.4
- fix README.md

### 1.1.5
- fix README.md

### 1.1.6
- resize on media query breakpoint changes

### 1.1.7
- icons and title bar styling

## Author

* **Douglas Hiles** 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* the gridList layout engine is based on the hootsuite GridList


