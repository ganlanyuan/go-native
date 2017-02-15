# Go-native
![version](https://img.shields.io/badge/Version-1.0.0-green.svg)   
Javascript polyfills which let you use native javascript. **Rewrite with ES2015 module**.   
[CSS3 selectors](https://www.w3.org/TR/css3-selectors/), [CSS3 media queries](https://www.w3.org/TR/css3-mediaqueries/), ES5 extensions and a bunch of DOM utilities.  
Tested on *IE 8+, Firefox 17+, Chrome 15+, Safari 4+, Opera 10+*.  

# Install
```
bower install go-native --save
```

# Contents
####go-native.ie8  
- [NWMatcher (for selectivizr)](https://github.com/dperini/nwmatcher)
- [selectivizr](http://selectivizr.com/)
- [respond.js](https://github.com/scottjehl/Respond)
- ES5 Array (`every`, `filter`, `forEach`, `indexOf`, `lastIndexOf`, `map`, `reduce`, `reduceRight`, `some`), Date (`now`, `parse`, `toISOString`, `toJSON`), Function (`bind`), Object (`create`, `defineProperties`, `defineProperty`, `freeze`, `getOwnPropertyDescriptor`, `getOwnPropertyNames`, `getPrototypeOf`, `isExtensible`, `isFrozen`, `isSealed`, `keys`, `preventExtensions`, `seal`) and String (`trim`) extensions
- Event-related methods:
  - `preventDefault`
  - `stopPropagation`
- EventTarget methods:
  - `addEventListener`
  - `removeEventListener`
- Element-related properties: 
  - `el.childElementCount`
  - `el.firstElementChild`
  - `el.lastElementChild`
  - `el.nextElementSibling`
  - `el.previousElementSibling`
- Node-related properties:
  - `node.textContent`
- Window-related properties/methods: 
  - `window.getComputedStyle`
  - `window.innerWidth`
  - `window.innerHeight`
  - `window.pageXOffset / window.scrollY`
  - `window.pageYOffset / window.scrollX`

####go-native
- ES5 methods:
  - `Number.isNaN`
  - `String.prototype.repeat`
- Element-related properties: 
  - `el.classList`
- Node-related properties:
  - `ChildNode.remove`
- [Length](https://github.com/heygrady/Units)
- requestAnimationFrame
- optimizedResize
- extend
- isNodeList
- DOM related utilities
  - DOM.ready
  - isInViewport
  - indexOf
  - getOuterWidth
  - getOuterHeight
  - getOffsetLeft
  - getOffsetTop
  - getSupportedProp
  - getClosest
  - getParents
  - getParentsUntil
  - getSiblings
  - createElement
  - append
  - prepend
  - wrap
  - wrapAll
  - unwrap

# Usage
`import` go-native in your script (make sure link to src folder, not dist folder)
```javascript
import * as gn from "../../src/go-native";
```
Or add [go-native.js](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.js) and [go-native.ie8.js](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.ie8.js) to your page.
````html
<!--[if (lt IE 9)]>
  <script src="path/to/go-native.ie8.js"></script>
<![endif]-->
<script src="path/to/go-native.js"></script>
````
# Methods
##### DOM.ready
```javascript
gn.ready(function () {
  // do something
  // on DOM ready
});
```
##### isInViewport
```javascript
var el = document.querySelector('.element');
if (gn.isInViewport(el)) {
  // when element is in viewport
  // do something
}
```
##### indexOf
```javascript
var index,
    list = document.querySelectorAll('.list > li'),
    current = document.querySelector('.current');

index = gn.indexOf(list, current);
```
##### getOuterWidth
```javascript
// content + padding + border + margin
var box = document.querySelector('.box'),
    boxWidth = gn.getOuterWidth(box);
```
##### getOuterHeight
```javascript
// content + padding + border + margin
var box = document.querySelector('.box'),
    boxHeight = gn.getOuterHeight(box);
```
##### getWidth
```javascript
// content width
var box = document.querySelector('.box'),
    boxWidth = gn.getWidth(box);
```
##### getHeight
```javascript
// content height
var box = document.querySelector('.box'),
    boxHeight = gn.getHeight(box);
```
##### getOffsetLeft
```javascript
var box = document.querySelector('.box'),
    boxLeft = gn.getOffsetLeft(box);
```
##### getOffsetTop
```javascript
var box = document.querySelector('.box'),
    boxTop = gn.getOffsetTop(box);
```
##### getSupportedProp
```javascript
var transitionDuration = gn.getSupportedProp(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration']);
console.log(transitionDuration);
```
##### getClosest
```javascript
var element = document.querySelector('.element'),
    red = gn.getClosest(element, '.red');
```
##### getParents
```javascript
var element = document.querySelector('.element'),
    red = gn.getParents(element, '.red');
```
##### getParentsUntil
```javascript
```
##### getSiblings
```javascript
var element = document.querySelector('.element'),
    siblings = gn.getSiblings(element);
```
##### createElement
```javascript
var el = gn.createElement({
  tagName: 'div',
  id: 'foo',
  className: 'foo',
  children: [{
   tagName: 'div',
   html: '<b>Hello, creatElement</b>',
   attributes: {
     'am-button': 'primary'
   }
  }]
});
```
##### append
```javascript
var container = document.querySelector('.container');
gn.append(container, '<li>Peach</li>');
gn.append(container, el);
```
##### prepend
```javascript
var container = document.querySelector('.container');
gn.prepend(container, '<li>Pear</li>');
gn.prepend(container, el);
```
##### wrap
```javascript
var p = doc.querySelectorAll('p'),
    div = doc.createElement('div');
gn.wrap(p, div);
```
##### wrapAll
```javascript
var p = doc.querySelectorAll('p'),
    div = doc.createElement('div');
gn.wrapAll(p, div);
```
##### unwrap
```javascript
var container = doc.querySelectorAll('.container');
gn.unwrap(container);
```

## Credit:
`NWMatcher` from [dperini](https://github.com/dperini/nwmatcher).   
`selectivizr` from [keithclark](https://github.com/keithclark/selectivizr).   
`respond` from [scottjehl](https://github.com/scottjehl/Respond).   
`Length` from [heygrady](https://github.com/heygrady/Units).   
`requestAnimationFrame` from [darius](https://github.com/darius/requestAnimationFrame).   
`indexOf` from [HubSpot/youmightnotneedjquery](https://github.com/HubSpot/YouMightNotNeedjQuery).

ES5 Array, Function, Date, Object and String extensions from [280north/narwhal](https://github.com/280north/narwhal/blob/master/engines/default/lib/global-es5.js).

`preventDefault`, `stopPropagation`, `addEventListener`, `removeEventListener`, `node.textContent` and `optimizedResize` from the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).  

`el.classList`, `el.childElementCount`, `el.firstElementChild`, `el.lastElementChild`, `el.nextElementSibling`, `el.previousElementSibling`, `ChildNode.remove`, `window.getComputedStyle`, `window.innerWidth`, `window.innerHeight`, `window.pageXOffset`, `window.pageYOffset`, `Array.isArray`, `Number.isNaN` and `String.prototype.repeat` from [Alhadis](https://github.com/Alhadis/Fix-IE).  

`DOM.ready`, `isInViewport`, `getClosest`, `getParents`, `getParentsUntil` and `getSiblings` from [Chris Ferdinandi](http://gomakethings.com/ditching-jquery/).

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.  