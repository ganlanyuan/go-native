# Go-native
Javascript polyfills that let you use native javascript.   
[CSS3 selectors](https://www.w3.org/TR/css3-selectors/), [CSS3 media queries](https://www.w3.org/TR/css3-mediaqueries/), basic ES5 extensions and a bunch of DOM utilities.

# Useage
Include [go-native.ie8.js (39k)](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.ie8.js) and [go-native.js (10k)](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.js) in your `<head>`. That's it!
````html
<!--[if (lt IE 9)]>
  <script src="path/to/go-native.ie8.js"></script>
<![endif]-->
<script src="path/to/go-native.js"></script>
````

# Contents
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
  - `window.pageXOffset`
  - `window.pageYOffset`


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

# Credit:
`HTML5 Shiv 3.7.3` by [aFarkas](https://github.com/aFarkas/html5shiv), `NWMatcher` by [dperini](https://github.com/dperini/nwmatcher), `selectivizr` by [keithclark](https://github.com/keithclark/selectivizr), matchmedia by [paulirish](https://github.com/paulirish/matchMedia.js), `respond` by [scottjehl](https://github.com/scottjehl/Respond), `Length` by [heygrady](https://github.com/heygrady/Units), `requestAnimationFrame` by [darius](https://github.com/darius/requestAnimationFrame), `indexOf` by [HubSpot/youmightnotneedjquery](https://github.com/HubSpot/YouMightNotNeedjQuery), `Object.keys` by [Craig Constable](http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html).

ES5 Array extensions, ES5 Function extensions (`bind`), 
`preventDefault`, `stopPropagation`, `addEventListener`, `removeEventListener`, `node.textContent` and `optimizedResize` are from the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).  

`el.classList`, `el.childElementCount`, `el.firstElementChild`, `el.lastElementChild`, `el.nextElementSibling`, `el.previousElementSibling`, `ChildNode.remove`, `window.getComputedStyle`, `window.innerWidth`, `window.innerHeight`, `window.pageXOffset`, `window.pageYOffset`, `Array.isArray`, `Number.isNaN`, `Date.now`, `String.prototype.trim` and `String.prototype.repeat` are from [Alhadis](https://github.com/Alhadis/Fix-IE).  

`DOM.ready`, `isInViewport`, `getClosest`, `getParents`, `getParentsUntil` and `getSiblings` are from [Chris Ferdinandi](http://gomakethings.com/ditching-jquery/).
