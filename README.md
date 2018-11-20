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
      lg: 5,
      md: 4,
      sm: 3,
      xs: 2
    },
    direction: 'vertical',
    highlightColor: '#85C1E9',
    marginPx: 10,
    borderPx: 10,
    headerPx: 40,
    gridContainerStyles: {
      'background-color': 'rgb(171, 171, 196)'
    },
    gridItemContainerStyles: {
    }
  };
  
  items = [
    { w: 3, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'})},
    { w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
    body: 'Submit your resume today!'}) },
    { w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent,   {headline: 'Openings in all departments',
    body: 'Apply today'}) }
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
### 1.1.2
- added gestures for mobile sensitive devices. Touch gesture triggers a pan which allows for repositioning of grid items. Press followed by a pan gesture allows resizing of grid items.   

## Author

* **Douglas Hiles** 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* the gridList layout engine is based on the hootsuite GridList


