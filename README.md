# go-native
A Javascript polyfills' collection which let you use native javascript.

# Contents
####[go-native.ie8.js](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.ie8.js)
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


####[go-native.all.js](https://raw.githubusercontent.com/ganlanyuan/go-native/master/dist/go-native.all.js)
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
- DOM.ready
- [Length](https://github.com/heygrady/Units)
- isInViewport
- getOuterWidth
- getOuterHeight
- getOffsetLeft
- getOffsetTop
- extend
- getSupportedProp
- indexOf
- getClosest
- getParents
- getParentsUntil
- getSiblings
- isNodeList
- append
- prepend

# Credit:
`HTML5 Shiv 3.7.3` is from [aFarkas](https://github.com/aFarkas/html5shiv), `NWMatcher` is from [dperini](https://github.com/dperini/nwmatcher), `selectivizr` is from [keithclark](https://github.com/keithclark/selectivizr), matchmedia is from [paulirish](https://github.com/paulirish/matchMedia.js), `respond` is from [scottjehl](https://github.com/scottjehl/Respond), `Length` is from [heygrady](https://github.com/heygrady/Units).

ES5 Array extensions, ES5 Function extensions (`bind`), 
`preventDefault`, `stopPropagation`, `addEventListener`, `removeEventListener`, `node.textContent`, are from the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).  

`el.classList`, `el.childElementCount`, `el.firstElementChild`, `el.lastElementChild`, `el.nextElementSibling`, `el.previousElementSibling`, `ChildNode.remove`, `window.getComputedStyle`, `window.innerWidth`, `window.innerHeight`, `window.pageXOffset`, `window.pageYOffset`, `Array.isArray`, `Number.isNaN`, `Date.now`, `String.prototype.trim`, `String.prototype.repeat`, are from [Alhadis](https://github.com/Alhadis/Fix-IE).  

`indexOf` from [HubSpot/youmightnotneedjquery](https://github.com/HubSpot/YouMightNotNeedjQuery)

`Object.keys` is form [Craig Constable](http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html)

DOM.ready, isInViewport, getClosest, getParents, getParentsUntil, getSiblings, from [Chris Ferdinandi](http://gomakethings.com/ditching-jquery/)
