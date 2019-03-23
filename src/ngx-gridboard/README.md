# ngx-gridboard

  

ngx-gridboard is an angular dashboard component which contains movable resizable panels each of which contains a custom component. The grid is built from a layout definition which specifies for each panel a component class and initial position and dimensions.

  

## Installation

  

npm install ngx-gridboard --save

  

## Usage

  

### Default usage

  

<gb-gridboard  [items]="items"  [options]="options" [itemUpdateEmitter]="itemUpdateEmitter"></gb-gridboard>

  

### Which expects a setup like the following:

  

#### options: fields for mediaQuery lanes are optional. When defined, lanes will be set to the current media query size. If mediaQueryLanes is undefined, the value for fixedLanes is used.

### items: PanelItems are created with a component and a data parameter. PanelItem Components are added to the entryComponents section of the calling module (see the demo code for an example).

#### header: each panel item has a header. A header contains a title and icons.  The height of headers is set in options.headerPx. Styling for headers are set in options.gridItemContainer.header,  options.gridItemContainer.title, and options.gridItemContainer.headerIcons.  The title displayed in each panel item comes from the item title defined in the items array,

#### toolbarItems: an array of definitions of icons displayed in the header of a panel item. In each component html a ng-template with a #iconTemplate template reference variable can be included i.e.


```javascript

<ng-template #iconTemplate let-toolbarItem='toolbarItem'>

<i class="material-icons" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick(toolbarItem)" title="{{toolbarItem.title}}">{{ toolbarItem.iconClass }}</i>

</ng-template>
```

  

The html contained in the ng-template tag is projected into the header for each toolbarItem. In the above example, inside the <i> tag the material-icons class refers to the styles loaded by adding a link in the demo to <link  href="https://fonts.googleapis.com/icon?family=Material+Icons"

rel="stylesheet"> which is included in index.html. You can customize this projected content to load a font-awesome icons or svg icons, etc. As well you can add your own properties to toolbarItems in options and refer to them in the html and use your own global css classes defined in styles.css (see header-icon).

  

##### toolbarItem properties

###### title: tooltip title string

###### ariaLabel: area label string

###### clickFunction: [myClickFunction(toolbarItem:any): void] name of a custom function defined in the component to be classed on click of the icon.

###### itemSelection:  parameter of type ItemSelection. Currently the enum constant supported are ItemSelection.Close, ItemSelection.Minimize, and ItemSelection.Maximize. When itemSelection is defined, a click event on the toolbarItem icon will trigger a panel close, minimize or maximize. If a clickFunction is already defined for the icon, the itemSelection will not be triggered. 



###### ifFunction: [myIfFunction(toolbarItem:any): boolean] name of a custom function defined in the component to be tested. When this function returns false, the icon is hidden. If a function is named but not defined for the component, the default result is true.

###### iconClass: icon class name string

###### iconStyle: icon style definitions i.e. { 'color': 'pink' }. These styles are applied to the specific toolbarItem and override styles applied to all toolbar icons defined in options.gridItemContainer.headerIcons.  
  
#### add new panels 
new panels can be added either by pushing a new item to the items array or defining an
item updater and emitting an item to add as follows:
```javascript
     itemUpdateEmitter: EventEmitter<any> = new EventEmitter<any>(); 

    this.itemUpdateEmitter.emit({ 
      operation: "add",
      item: item 
    });
``` 
##### in the last lane position

```javascript

    this.itemUpdateEmitter.emit({ 
      operation: "add",
      lanePosition: "last",
      item: item 
    });
```    

when "lanePosition" is "last", and the direction is vertical, the newly added panel is positioned immediately to the right of the last panel on the specified 'x' row and for horizontal the newly added panel is positioned below the last panel on the specified 'y' column' If "lanePosition' is undefined or not "last" the default behavior is to attempt to position the newly added panel at the specified x,y position.  

#### options example

```javascript
 
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

```


## Online Demo

http://seatoskysoft.com/ngx-gridboard-demo/

  

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

  

### 1.1.9

- custom icons in panel header

### 1.1.10

- add panel minimize/maximize
- itemUpdateEmitter lanePosition paramter for add  
  

## Author

  

*  **Douglas Hiles**

  
  

## License

  

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

  

## Acknowledgments

  

* the gridList layout engine is based on the hootsuite GridList