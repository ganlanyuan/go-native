/** ChildNode.remove */
if(!("remove" in Element.prototype)){
	Element.prototype.remove = function(){
		if(this.parentNode)
			this.parentNode.removeChild(this);
	};
}


/** DOMTokenList */
!function(){"use strict";var n,r,t,e,i=window,o=document,u=Object,f=null,a=!0,c=!1,l=" ",s="Element",d="create"+s,h="DOMTokenList",m="__defineGetter__",p="defineProperty",v="class",g="List",y=v+g,w="rel",L=w+g,_="div",b="length",j="contains",S="apply",k="HTML",E=("item "+j+" add remove toggle toString toLocaleString").split(l),A=E[2],C=E[3],M=E[4],N="prototype",O=p in u||m in u[N]||f,T=function(n,r,t,e){u[p]?u[p](n,r,{configurable:c===O?a:!!e,get:t}):n[m](r,t)},x=function(r,t){var e=this,i=[],o={},f=0,s=0,d=function(){if(f>=s)for(;f>s;++s)(function(n){T(e,n,function(){return h(),i[n]},c)})(s)},h=function(){var n,e,u=arguments,c=/\s+/;if(u[b])for(e=0;e<u[b];++e)if(c.test(u[e]))throw n=new SyntaxError('String "'+u[e]+'" '+j+" an invalid character"),n.code=5,n.name="InvalidCharacterError",n;for(i=(""+r[t]).replace(/^\s+|\s+$/g,"").split(c),""===i[0]&&(i=[]),o={},e=0;e<i[b];++e)o[i[e]]=a;f=i[b],d()};return h(),T(e,b,function(){return h(),f}),e[E[6]]=e[E[5]]=function(){return h(),i.join(l)},e.item=function(n){return h(),i[n]},e[j]=function(n){return h(),!!o[n]},e[A]=function(){h[S](e,n=arguments);for(var n,u,c=0,s=n[b];s>c;++c)u=n[c],o[u]||(i.push(u),o[u]=a);f!==i[b]&&(f=i[b]>>>0,r[t]=i.join(l),d())},e[C]=function(){h[S](e,n=arguments);for(var n,u={},c=0,s=[];c<n[b];++c)u[n[c]]=a,delete o[n[c]];for(c=0;c<i[b];++c)u[i[c]]||s.push(i[c]);i=s,f=s[b]>>>0,r[t]=i.join(l),d()},e[M]=function(r,t){return h[S](e,[r]),n!==t?t?(e[A](r),a):(e[C](r),c):o[r]?(e[C](r),c):(e[A](r),a)},function(n,r){if(r)for(var t=0;7>t;++t)r(n,E[t],{enumerable:c})}(e,u[p]),e},D=function(n,r,t){T(n[N],r,function(){var n,e=this,i=m+p+r;if(e[i])return n;if(e[i]=a,c===O){for(var u,f=D.mirror=D.mirror||o[d](_),l=f.childNodes,s=l[b],h=0;s>h;++h)if(l[h]._R===e){u=l[h];break}u||(u=f.appendChild(o[d](_))),n=x.call(u,e,t)}else n=new x(e,t);return T(e,r,function(){return n}),delete e[i],n},a)};if(i[h])r=o[d](_)[y],N=i[h][N],r[A][S](r,E),2>r[b]&&(t=N[A],e=N[C],N[A]=function(){for(var n=0,r=arguments;n<r[b];++n)t.call(this,r[n])},N[C]=function(){for(var n=0,r=arguments;n<r[b];++n)e.call(this,r[n])}),r[M](g,c)&&(N[M]=function(r,t){var e=this;return e[(t=n===t?!e[j](r):t)?A:C](r),!!t});else{if(O)try{T({},"support")}catch(G){O=c}x.polyfill=a,i[h]=x,D(i[s],y,v+"Name"),D(i[k+"Link"+s],L,w),D(i[k+"Anchor"+s],L,w),D(i[k+"Area"+s],L,w)}}();


/**
 * Polyfills for Array methods defined in ECMA-262, 5th edition (ES5).
 *
 * All implementations taken from the Mozilla Developer Network, with
 * inline annotations removed and shit indentation corrected (dear world:
 * stop using 2-space tabs, SERIOUSLY.)
 */


/** Every */
if(!Array.prototype.every){
	
	Array.prototype.every = function(fn, thisArg){
		"use strict";
		var T, k;
		
		if(this == null)
			throw new TypeError("'this' is null or not defined");
		
		var O = Object(this);
		var l = O.length >>> 0;
		if("function" !== typeof fn)
			throw new TypeError();
		
		if(arguments.length > 1)
			T = thisArg;
		
		k = 0;
		while (k < l){
			var kValue;
			if(k in O){
				kValue = O[k];
				var testResult = fn.call(T, kValue, k, O);
				if(!testResult) return false;
			}
			k++;
		}
		return true;
	};
}




/** Filter */
if(!Array.prototype.filter){	
	Array.prototype.filter = function(fn){
		"use strict";
		
		if(this === void 0 || this === null)
			throw new TypeError();
		
		var t      = Object(this);
		var length = t.length >>> 0;
		if("function" !== typeof fn)
			throw new TypeError();
		
		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for(var val, i = 0; i < length; i++){
			if(i in t){
				if(fn.call(thisArg, val = t[i], i, t))
					res.push(val);
			}
		}
		
		return res;
	};
}



/** forEach */
if(!Array.prototype.forEach){

	Array.prototype.forEach = function(callback, thisArg){
		var T, k;
		
		if(this === null)
			throw new TypeError(" this is null or not defined");
		
		var O = Object(this);
		var l = O.length >>> 0;
		
		if("function" !== typeof callback)
			throw new TypeError(callback + " is not a function");
		
		if(arguments.length > 1)
			T = thisArg;
		
		k = 0;
		while(k < l){
			var kValue;
			if(k in O){
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}



/** indexOf */
if(!Array.prototype.indexOf){
	
	Array.prototype.indexOf = function(searchElement, fromIndex){
		var k;
		
		if(this == null)
			throw new TypeError('"this" is null or not defined');
		
		var o = Object(this);
		var l = o.length >>> 0;
		if(l === 0)
			return -1;
		
		var n = +fromIndex || 0;
		if(Math.abs(n) === Infinity)
			n = 0;
		
		if(n >= l)
			return -1;
		k = Math.max(n >= 0 ? n : l - Math.abs(n), 0);
		
		while(k < l){
			if(k in o && o[k] === searchElement)
				return k;
			k++;
		}
		return -1;
	};
}



/** lastIndexOf */
if(!Array.prototype.lastIndexOf){
	
	Array.prototype.lastIndexOf = function(searchElement){
		"use strict";
		
		if(this === void 0 || this === null)
			throw new TypeError();
		
		var n, k,
		t   = Object(this),
		len = t.length >>> 0;
		
		if(len === 0)
			return -1;
		
		n = len - 1;
		if(arguments.length > 1){
			n = Number(arguments[1]);
			if(n != n) n = 0;
			else if(n != 0 && n != (1 / 0) && n != -(1 / 0))
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
		
		for(k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--)
			if(k in t && t[k] === searchElement) return k;
		return -1;
	};
}



/** Map */
if(!Array.prototype.map){
	
	Array.prototype.map = function(fn, thisArg){
		var T, A, k;
		
		if(this == null)
			throw new TypeError('"this" is null or not defined');
		
		var O = Object(this);
		var l = O.length >>> 0;
		
		if("function" !== typeof fn)
			throw new TypeError(fn + " is not a function");
		
		if(arguments.length > 1)
			T = thisArg;
		
		A = new Array(l);
		k = 0;
		while (k < l){
			var kValue, mappedValue;
			if(k in O){
				kValue = O[k];
				mappedValue = fn.call(T, kValue, k, O);
				A[k] = mappedValue;
			}
			k++;
		}
		
		return A;
	};
}



/** Reduce */
if(!Array.prototype.reduce){
	Array.prototype.reduce = function(fn){
		"use strict";
		
		if(this == null)
			throw new TypeError("Array.prototype.reduce called on null or undefined");
		
		if("function" !== typeof fn)
			throw new TypeError(fn + " is not a function");
		
		var t = Object(this), len = t.length >>> 0, k = 0, value;
		if(2 === arguments.length)
			value = arguments[1];
		
		else{
			while(k < len && !(k in t)) k++;
			if(k >= len)
				throw new TypeError("Reduce of empty array with no initial value");
			value = t[k++];
		}
		
		for(; k < len; k++)
			if(k in t) value = fn(value, t[k], k, t);
		
		return value;
	};
}



/** reduceRight */
if(!Array.prototype.reduceRight){
	
	Array.prototype.reduceRight = function(fn){
		"use strict";
		
		if(null == this)
			throw new TypeError("Array.prototype.reduce called on null or undefined");
		
		if("function" !== typeof fn)
			throw new TypeError(fn + " is not a function");
		
		var t = Object(this), len = t.length >>> 0, k = len - 1, value;
		if(arguments.length >= 2)
			value = arguments[1];
		
		else{
			while(k >= 0 && !(k in t)) k--;
			if(k < 0)
				throw new TypeError("Reduce of empty array with no initial value");
			value = t[k--];
		}
		
		for(; k >= 0; k--)
			if(k in t) value = fn(value, t[k], k, t);
		return value;
	};
}



/** Some */
if(!Array.prototype.some){
	
	Array.prototype.some = function(fn){
		"use strict";
		
		if(this == null)
			throw new TypeError("Array.prototype.some called on null or undefined");
		
		if(typeof fn !== "function")
			throw new TypeError();
		
		var t = Object(this);
		var l = t.length >>> 0;
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for(var i = 0; i < l; i++)
			if(i in t && fn.call(thisArg, t[i], i, t)) return true;
		return false;
	};
}


Date.now                = Date.now                || function(){return +new Date};
String.prototype.trim   = String.prototype.trim   || function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");};
Object.defineProperties = Object.defineProperties || function(obj, props){for(var i in props) Object.defineProperty(obj, i, props[i]);};
Array.isArray           = Array.isArray           || function(obj){return "[object Array]" === Object.prototype.toString.call(obj)};
Number.isNaN            = Number.isNaN            || function(val){return val !== val};
String.prototype.repeat = String.prototype.repeat || function(num){return Array(num + 1).join(this)};


/**
 * ES5 Function bind
 *
 *https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 *
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/** 
  * Object.keys polyfill 
  * from Token Posts
  * http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html
  */
if (!Object.keys) {
  Object.keys = function(o) {
    if (o !== Object(o)) { throw new TypeError('Object.keys called on a non-object'); }
    var k=[],p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o,p)) { k.push(p); }
    }
    return k;
  };
}

/** Store "constants" on the window object to flag specific versions of Explorer. */
(function(){
	var i      = 6,
	WIN        = window,
	DOC        = document,
	IE_VERSION = "IE_VERSION";
	
	function is(v){
		var div = DOC.createElement("div");
		div.innerHTML = "<!--[if " + v + "]><i></i><![endif]-->";
		return div.getElementsByTagName("i").length;
	}
	
	for(; i < 10; ++i) if(is("IE " + i))
		WIN["IS_IE" + i ] = true,
		WIN[ IE_VERSION ] = i;

	is("IEMobile") && (WIN.IS_IEMobile = true);
	
	/** Might as well flag the root element with CSS classes while we're here. */
	DOC.documentElement.classList.add("ie", "ie"+WIN[ IE_VERSION ]);
}());


(function(window, document, undefined){
"use strict";

// create a test element
var testElem = document.createElement('test'),
    docElement = document.documentElement,
    defaultView = document.defaultView,
    getComputedStyle = defaultView && defaultView.getComputedStyle,
    computedValueBug,
    runit = /^(-?[\d+\.\-]+)([a-z]+|%)$/i,
    convert = {},
    conversions = [1/25.4, 1/2.54, 1/72, 1/6],
    units = ['mm', 'cm', 'pt', 'pc', 'in', 'mozmm'],
    i = 6; // units.length

// add the test element to the dom
docElement.appendChild(testElem);

// test for the WebKit getComputedStyle bug
// @see http://bugs.jquery.com/ticket/10639
if (getComputedStyle) {
    // add a percentage margin and measure it
    testElem.style.marginTop = '1%';
    computedValueBug = getComputedStyle(testElem).marginTop === '1%';
}

// pre-calculate absolute unit conversions
while(i--) {
    convert[units[i] + "toPx"] = conversions[i] ? conversions[i] * convert.inToPx : toPx(testElem, '1' + units[i]);
}

// remove the test element from the DOM and delete it
docElement.removeChild(testElem);
testElem = undefined;

// convert a value to pixels
function toPx(elem, value, prop, force) {
    // use width as the default property, or specify your own
    prop = prop || 'width';

    var style,
        inlineValue,
        ret,
        unit = (value.match(runit)||[])[2],
        conversion = unit === 'px' ? 1 : convert[unit + 'toPx'],
        rem = /r?em/i;

    if (conversion || rem.test(unit) && !force) {
        // calculate known conversions immediately
        // find the correct element for absolute units or rem or fontSize + em or em
        elem = conversion ? elem : unit === 'rem' ? docElement : prop === 'fontSize' ? elem.parentNode || elem : elem;

        // use the pre-calculated conversion or fontSize of the element for rem and em
        conversion = conversion || parseFloat(curCSS(elem, 'fontSize'));

        // multiply the value by the conversion
        ret = parseFloat(value) * conversion;
    } else {
        // begin "the awesome hack by Dean Edwards"
        // @see http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // remember the current style
        style = elem.style;
        inlineValue = style[prop];

        // set the style on the target element
        try {
            style[prop] = value;
        } catch(e) {
            // IE 8 and below throw an exception when setting unsupported units
            return 0;
        }

        // read the computed value
        // if style is nothing we probably set an unsupported unit
        ret = !style[prop] ? 0 : parseFloat(curCSS(elem, prop));

        // reset the style back to what it was or blank it out
        style[prop] = inlineValue !== undefined ? inlineValue : null;
    }

    // return a number
    return ret;
}

// return the computed value of a CSS property
function curCSS(elem, prop) {
    var value,
        pixel,
        unit,
        rvpos = /^top|bottom/,
        outerProp = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
        innerHeight,
        parent,
        i = 4; // outerProp.length
    
    if (getComputedStyle) {
        // FireFox, Chrome/Safari, Opera and IE9+
        value = getComputedStyle(elem)[prop];
    } else if (pixel = elem.style['pixel' + prop.charAt(0).toUpperCase() + prop.slice(1)]) {
        // IE and Opera support pixel shortcuts for top, bottom, left, right, height, width
        // WebKit supports pixel shortcuts only when an absolute unit is used
        value = pixel + 'px';
    } else if (prop === 'fontSize') {
        // correct IE issues with font-size
        // @see http://bugs.jquery.com/ticket/760
        value = toPx(elem, '1em', 'left', 1) + 'px';
    } else {
        // IE 8 and below return the specified style
        value = elem.currentStyle[prop];
    }

    // check the unit
    unit = (value.match(runit)||[])[2];
    if (unit === '%' && computedValueBug) {
        // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
        if (rvpos.test(prop)) {
            // Top and bottom require measuring the innerHeight of the parent.
            innerHeight = (parent = elem.parentNode || elem).offsetHeight;
            while (i--) {
              innerHeight -= parseFloat(curCSS(parent, outerProp[i]));
            }
            value = parseFloat(value) / 100 * innerHeight + 'px';
        } else {
            // This fixes margin, left, right and text-indent
            // @see https://bugs.webkit.org/show_bug.cgi?id=29084
            // @see http://bugs.jquery.com/ticket/10639
            value = toPx(elem, value);
        }
    } else if ((value === 'auto' || (unit && unit !== 'px')) && getComputedStyle) {
        // WebKit and Opera will return auto in some cases
        // Firefox will pass back an unaltered value when it can't be set, like top on a static element
        value = 0;
    } else if (unit && unit !== 'px' && !getComputedStyle) {
        // IE 8 and below won't convert units for us
        // try to convert using a prop that will return pixels
        // this will be accurate for everything (except font-size and some percentages)
        value = toPx(elem, value) + 'px';
    }
    return value;
}

// expose the conversion function to the window object
window.Length = {
    toPx: toPx
};
}(this, this.document));

var ready = function ( fn ) {

  // Sanity check
  if ( typeof fn !== 'function' ) return;

  // If document is already loaded, run method
  if ( document.readyState === 'complete'  ) {
    return fn();
  }

  // Otherwise, wait until document is loaded
  document.addEventListener( 'DOMContentLoaded', fn, false );

};

// ** extend ** //
function extend() {
  var obj, name, copy,
  target = arguments[0] || {},
  i = 1,
  length = arguments.length;

  for (; i < length; i++) {
    if ((obj = arguments[i]) !== null) {
      for (name in obj) {
        copy = obj[name];

        if (target === copy) {
          continue;
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}

// *** isInViewport *** //
var isInViewport = function ( elem ) {
  var rect = elem.getBoundingClientRect();
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/* get supported property */
function getSupportedProp(proparray){
  var root = document.documentElement;
  for (var i=0; i<proparray.length; i++){
    if (proparray[i] in root.style){
      return proparray[i];
    }
  }
}
// var getTD = getSupportedProp(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration']),
// getTransform = getSupportedProp(['transform', 'WebkitTransform', 'MozTransform', 'OTransform']);

/* offsetLeft */
var offsetLeft = function (el) {
  var rect = el.getBoundingClientRect(),
      left = rect.left + document.body.scrollLeft;
  return Math.round(left);
};


/* offsetTop */
var offsetTop = function (el) {
  var rect = el.getBoundingClientRect(),
      top = rect.top + document.body.scrollTop;
  return Math.round(top);
};



/* get elements size */
// 1. outer size: content + padding + border + margin //
function outerWidth(el) {
  var width = el.offsetWidth;
  var style = el.currentStyle || getComputedStyle(el);

  width += parseInt(Length.toPx(el, style.marginLeft)) + parseInt(Length.toPx(el, style.marginRight));
  return width;
}

function outerHeight(el) {
  var height = el.offsetHeight;
  var style = el.currentStyle || getComputedStyle(el);

  height += parseInt(Length.toPx(el, style.marginTop)) + parseInt(Length.toPx(el, style.marginBottom));
  return height;
}

// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight

/**
  * All
  */
// @codekit-prepend "../bower_components/fix-ie/src/remove.js";
// @codekit-prepend "../bower_components/fix-ie/src/token-list.js";
// @codekit-prepend "../bower_components/fix-ie/src/es5-arrays.js";
// @codekit-prepend "../bower_components/fix-ie/src/es5-methods.js";
// @codekit-prepend "components/es5-function.bind.js";
// @codekit-prepend "components/es5-object.keys.js";
// @codekit-prepend "../bower_components/fix-ie/src/version-flags.js";


// @codekit-prepend "../bower_components/Units/Length.js";
// @codekit-prepend "components/DOM.ready.js";
// @codekit-prepend "components/extend.js";
// @codekit-prepend "components/isInViewport.js";
// @codekit-prepend "components/getSupportedProp.js";
// @codekit-prepend "components/getElementOffset.js";
// @codekit-prepend "components/getElementSize.js";

/**
  * not includeed
  */
// codekit-prepend "../bower_components/fix-ie/src/IE8-addEventListener.js";
// codekit-prepend "../bower_components/es5-shim/es5-shim.js";
// codekit-prepend "components/IE8-getComputedStyle.js";


