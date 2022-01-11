# ngx-gridboard

  

ngx-gridboard is an angular dashboard component which contains movable resizable panels each of which contains a custom component. The grid is built from a layout definition which specifies for each panel a component class and initial position and dimensions.

  

## Installation

  

npm install ngx-gridboard --save

  

## Usage

  

### Default usage
(see NGX-GRIDBOARD/demo/src/app/app.component.html)

  

<gb-gridboard  [items]="items"  [options]="options" [itemUpdateEmitter]="itemUpdateEmitter"></gb-gridboard>

  

## Which expects parameters to be setup like the following:
(see NGX-GRIDBOARD/demo/src/app/app.component.ts)

### items 

PanelItems are defined by the items parameter. PanelItem Components are included in the entryComponents section of the application module (see NGX-GRIDBOARD/demo/src/app/app.module.ts)

#### items example
```javascript
 
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
      w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
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
      ],w: 1, h: 1, x: 0, y: 0,
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
      w: 1, h: 1, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'Openings in all departments',
        body: 'Apply today'
      })
    }
  ];

```



  
### options
#### options example

```javascript
 
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



```

### mediaQuery lanes

fields for mediaQuery lanes are optional. When defined, lanes will be set to the current media query size. If mediaQueryLanes is undefined, the value for fixedLanes is used.

### responsiveBreakpoints 

media query defaults to xs: 600, sm: 960, md: 1280, lg: 1920. Breakpoint values can be optionally set to custom values by defining the responsiveBreakpoints options as in the following example:  
```javascript
 
  options = {
    responsiveBreakpoints: {
      xl: 1111
      lg: 960,
      md: 700,
      sm: 500,
      xs: 200
    }
  };

```


### gridContainer 
the gridContainer can optionally be set to a static width and height by setting pixel values as shown in this options example:

```javascript
 
  options = {
    gridContainer: {
        width: 500,
        height: 800
    }
  };

```

If one or both of these optional values are not defined the default gridContainer sizing is to add an extra row width to the bottom of the gridContainer to facilitate panel dragging when the direction option is set to vertical. For horizontal direction an extra column width is added to the right if an optional gridContainer width is not defined.

#### header
each panel item has a header. A header contains a title and icons.  The height of headers is set in options.headerPx. 

#### styles
##### gridContainer
these are css definitions for the grid that contains all the panels. These properties are defined in a 'grid-container' block.

##### positionHighlight
this is the rectangle that is displayed over the target location when dragging a panel.  css properties are defined in a 'grid-container' block.

##### gridItemContainer
this is css definitions for each panel. Styling for headers are set in options.gridItemContainer.header,  options.gridItemContainer.title, and options.gridItemContainer.headerIcons.


### itemUpdateEmitter
```javascript
     itemUpdateEmitter: EventEmitter<any> = new EventEmitter<any>(); 

``` 
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

###### 
operation: "add"
when "lanePosition" is "last", and the direction is vertical, the newly added panel is positioned below the last cell on the furthest right column and for the horizontal direction, the added panel it added to the right of the bottom row

###### 
operation: "remove"

```javascript

    this.itemUpdateEmitter.emit({ 
      operation: "remove",
      position: {x:0,y:0},
      item: item 
    });
```    
when operation is "remove", position specifies the x and y coords of the item to be removed




### ToolbarItems
an array of definitions of icons displayed in the header of a panel item. In each component html a ng-template with a #iconTemplate template reference variable can be included. (see NGX-GRIDBOARD/demo/src/app/components/)


```javascript

<ng-template #iconTemplate let-toolbarItem='toolbarItem'>

<i class="material-icons" [ngStyle]="toolbarItem.iconStyle" (click)="handleClick(toolbarItem)" title="{{toolbarItem.title}}">{{ toolbarItem.iconClass }}</i>

</ng-template>
```

  

The html contained in the ng-template tag is projected into the header for each toolbarItem. In the above example, inside the 

```javascript
<i>
```
tag the material-icons class refers to the styles loaded by adding a link in the demo to <link  href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> which is included in index.html. You can customize this projected content to load a font-awesome icons or svg icons, etc. As well you can add your own properties to toolbarItems in options and refer to them in the html and use your own global css classes defined in styles.css (see header-icon).

### toolbarItem properties

#### title
tooltip title string

#### ariaLabel
aria label string

#### clickFunction
[myClickFunction(toolbarItem:any): void] name of a custom function defined in the component to be classed on click of the icon.

#### itemSelection
parameter of type ItemSelection. Currently the enum constant supported are ItemSelection.Close, ItemSelection.Minimize, and ItemSelection.Maximize. When itemSelection is defined, a click event on the toolbarItem icon will trigger a panel close, minimize or maximize. If a clickFunction is already defined for the icon, the itemSelection will not be triggered. 



#### ifFunction
[myIfFunction(toolbarItem:any): boolean] name of a custom function defined in the component to be tested. When this function returns false, the icon is hidden. If a function is named but not defined for the component, the default result is true.

#### iconClass
icon class name string

#### iconStyle
icon style definitions i.e. { 'color': 'pink' }. These styles are applied to the specific toolbarItem and override styles applied to all toolbar icons defined in options.gridItemContainer.headerIcons.  
  
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

### 1.1.11

- fix icon header alignment
- set non-maximized panels to hidden on maximize  
- emit resize events when resizing 

### 1.1.12

- fix npm security violation in tar node pkg version by setting node-gyp version 4.0.0 
- fix bug with not passing toolbaritem to ifFunction
- add mutexMinMaxIcons option to remove or disable minimize icon when panel is not maximized and remove or disable maximize icon when panel is maximized
- add description field to panel item to display description tooltip on title

### 1.1.13

- when make sure all panels are visible by decrementing lane count when a panel is covered (rather than scrolling) and triggering a responsive lane count update when a full row or column is visible  

### 1.1.14

- throttle mouse events
- fix npm security violation by setting querystringify to version 2.1.1
- add responsiveBreakpoints and gridContainer width and height options

### 1.1.15
- upgrade to angular 8

### 1.1.16
- remove options.gridContainer (width and height). Set static width and height on gridContainer parent using css if non-resizing container required.
- resize columns and fill cells on resize end. 
- on maximize include grid and gridContainer offset height so maximized height fits in visible window.
- on minimize ensure previous minimized cell layout is presented unless fixedColumns changes. 

### 1.1.17
  - upgrade to angular 11
  - set styles in NgxGridboardItemContainerComponent using HostBinding
  - provide layout$ observable in PanelComponent
  - only trigger window resize event when lane direction vertical
  - add "remove" option to itemUpdateEmitter handling 

### 1.1.18
  - upgrade to angular 13
  
### 1.1.19
  - fix css positionHighlight styles setting from options


## Author

  
*  **Douglas Hiles**

  
  

## License

  

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

  

## Acknowledgments

  

* the gridList layout engine is based on the hootsuite GridList