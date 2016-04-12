## Go-native
Javascript polyfills that let you use native javascript.   
[CSS3 selectors](https://www.w3.org/TR/css3-selectors/), [CSS3 media queries](https://www.w3.org/TR/css3-mediaqueries/), basic ES5 extensions and a bunch of DOM utilities.  
![version](https://img.shields.io/badge/Version-0.0.0-green.svg)  

## Install
```
bower install go-native --save
```

## Contents
####go-native.ie8  
- ES5 Array extensions (`every, filter, forEach, indexOf, lastIndexOf, map, reduce, reduceRight, some`)
- ES5 Function extensions (`bind`)
- [HTML5 Shiv 3.7.3](https://github.com/aFarkas/html5shiv)
- IE8 CSS3 selectors supports ([supported selector list](http://selectivizr.com/))
  - NWMatcher
  - selectivizr
- IE8 media query support ([limitation](https://github.com/scottjehl/Respond#user-content-support--caveats))
  - matchmedia 
  - respond
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
  - `Date.now`
  - `Number.isNaN`
  - `String.prototype.trim`
  - `String.prototype.repeat`
  - `Array.isArray`
  - `Object.defineProperties`
  - `Object.keys`
- Element-related properties: 
  - `el.classList`
- Node-related properties:
  - `ChildNode.remove`
- [Length](https://github.com/heygrady/Units)
- requestAnimationFrame
- optimizedResize (require forEach/ES5-arrays)
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

## Usage
Include [go-native.ie8.js (39k)](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.ie8.js) and [go-native.js (10k)](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.js) into your markup, and go play with it.
````html
<!--[if (lt IE 9)]>
  <script src="path/to/go-native.ie8.js"></script>
<![endif]-->
<script src="path/to/go-native.js"></script>
````
##### DOM.ready
```javascript
gn.ready(function () {
  // on DOM ready
  // do something
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
`HTML5 Shiv 3.7.3` by [aFarkas](https://github.com/aFarkas/html5shiv), `NWMatcher` by [dperini](https://github.com/dperini/nwmatcher), `selectivizr` by [keithclark](https://github.com/keithclark/selectivizr), matchmedia by [paulirish](https://github.com/paulirish/matchMedia.js), `respond` by [scottjehl](https://github.com/scottjehl/Respond), `Length` by [heygrady](https://github.com/heygrady/Units), `requestAnimationFrame` by [darius](https://github.com/darius/requestAnimationFrame), `indexOf` by [HubSpot/youmightnotneedjquery](https://github.com/HubSpot/YouMightNotNeedjQuery), `Object.keys` by [Craig Constable](http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html).

ES5 Array extensions, ES5 Function extensions (`bind`), 
`preventDefault`, `stopPropagation`, `addEventListener`, `removeEventListener`, `node.textContent` and `optimizedResize` are from the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).  

`el.classList`, `el.childElementCount`, `el.firstElementChild`, `el.lastElementChild`, `el.nextElementSibling`, `el.previousElementSibling`, `ChildNode.remove`, `window.getComputedStyle`, `window.innerWidth`, `window.innerHeight`, `window.pageXOffset`, `window.pageYOffset`, `Array.isArray`, `Number.isNaN`, `Date.now`, `String.prototype.trim` and `String.prototype.repeat` are from [Alhadis](https://github.com/Alhadis/Fix-IE).  

`DOM.ready`, `isInViewport`, `getClosest`, `getParents`, `getParentsUntil` and `getSiblings` are from [Chris Ferdinandi](http://gomakethings.com/ditching-jquery/).
