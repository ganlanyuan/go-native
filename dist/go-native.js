/**
 * Adds support to IE8 for the following properties:
 *
 *     Element.childElementCount
 *     Element.firstElementChild
 *     Element.lastElementChild
 *     Element.nextElementSibling
 *     Element.previousElementSibling
 */
(function(){
	"use strict";
	
	
	var patches = {
		
		firstElementChild: function(){
			for(var nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i)
				if(n = nodes[i], 1 === n.nodeType) return n;
			return null;
		},
		
		lastElementChild: function(){
			for(var nodes = this.children, n, i = nodes.length - 1; i >= 0; --i)
				if(n = nodes[i], 1 === n.nodeType) return n;
			return null;
		},
		
		nextElementSibling: function(){
			var e = this.nextSibling;
			while(e && 1 !== e.nodeType)
				e = e.nextSibling;
			return e;
		},
		
		previousElementSibling: function(){
			var e = this.previousSibling;
			while(e && 1 !== e.nodeType)
				e = e.previousSibling;
			return e;
		},
		
		childElementCount: function(){
			for(var c = 0, nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i)
				(n = nodes[i], 1 === n.nodeType) && ++c;
			return c;
		}
	};
	
	for(var i in patches)
		i in document.documentElement ||
		Object.defineProperty(Element.prototype, i, {get: patches[i]});
}());


window.getComputedStyle = window.getComputedStyle || function(el){
	if(!el) return null;
	
	/**
	 * currentStyle returns an instance of a non-standard class called "CSSCurrentStyleDeclaration"
	 * instead of "CSSStyleDeclaration", which has a few methods and properties missing (such as cssText).
	 * https://msdn.microsoft.com/en-us/library/cc848941(v=vs.85).aspx
	 *
	 * Instead of returning the currentStyle value directly, we'll copy its properties to the style
	 * of a shadow element. This ensures cssText is included, and ensures the result is an instance of
	 * the correct DOM interface.
	 *
	 * There'll still be some minor discrepancies in the style values. For example, IE preserves the way
	 * colour values were authored, whereas standards-compliant browsers will expand colours to use "rgb()"
	 * notation. We won't bother to fix things like these, as they'd involve too much fiddling for little
	 * gain.
	 */
	
	var style   = el.currentStyle;
	var box     = el.getBoundingClientRect();
	var shadow  = document.createElement("div");
	var output  = shadow.style;
	for(var i in style)
		output[i] = style[i];
	
	/** Fix some glitches */
	output.cssFloat = output.styleFloat;
	if("auto" === output.width)  output.width  = (box.right - box.left) + "px";
	if("auto" === output.height) output.height = (box.bottom - box.top) + "px";
	return output;
};


/** window.pageXOffset / window.pageYOffset */
if(!("pageXOffset" in window)) (function(){
	var x = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollLeft; };
	var y = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollTop;  };
	Object.defineProperty(window, "pageXOffset", {get: x});
	Object.defineProperty(window, "pageYOffset", {get: y});
	Object.defineProperty(window, "scrollX",     {get: x});
	Object.defineProperty(window, "scrollY",     {get: y});
}());

/** window.innerWidth / window.innerHeight */
if(!("innerWidth" in window)){
	Object.defineProperty(window, "innerWidth",  {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientWidth; }});
	Object.defineProperty(window, "innerHeight", {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientHeight; }});
}

/** event.pageX / event.pageY */
if(!window.MouseEvent && !("pageX" in Event.prototype)){
	Object.defineProperty(Event.prototype, "pageX", {get: function(){ return this.clientX + window.pageXOffset; }});
	Object.defineProperty(Event.prototype, "pageY", {get: function(){ return this.clientY + window.pageYOffset; }});
}


/** IE8< polyfill for addEventListener */
(function(){
	if(!document.createElement("div").addEventListener){

		var cache = "_eventListeners",


		/** Ties an event listener to an element. */
		addEvent = function(name, fn){
			var THIS = this;
			if(!(cache in THIS))    THIS[cache]       = {};
			if(!THIS[cache][name])  THIS[cache][name] = [];

			/** Check that we're not adding duplicate listeners for this event type. */
			var handlers = THIS[cache][name], i;
			for(i in handlers)
				if(fn === handlers[i][0]) return;

			handlers.push([fn, fn = function(fn){
				return function(e){
					var e = e || window.event;
					if(!("target" in e))    e.target          = e.srcElement;
					if(!e.preventDefault)   e.preventDefault  = function(){this.returnValue = false;}
					return fn.call(THIS, e);
				};
			}(fn)]);

			THIS.attachEvent("on" + name, fn);
		},



		/** Removes an event listener from an element. */
		removeEvent = function(name, fn){
			var THIS = this;
			if(!(cache in THIS))    THIS[cache]       = {};
			if(!THIS[cache][name])  THIS[cache][name] = [];

			var handlers = THIS[cache][name], i;
			for(i in handlers){
				if(fn === handlers[i][0]){
					THIS.detachEvent("on"+name, handlers[i][1]);
					delete handlers[i];
				}
			}
		};


		Object.defineProperty(Element.prototype, "addEventListener",    {value: addEvent});
		Object.defineProperty(Element.prototype, "removeEventListener", {value: removeEvent});
		document.addEventListener     = addEvent;
		document.removeEventListener  = removeEvent;

		/** Reroute the window's add/removeEventListener methods to the document, since IE8 has "issues" with events bubbling to the window, apparently. */
		window.addEventListener       = function(){ addEvent.apply(document, arguments);    };
		window.removeEventListener    = function(){ removeEvent.apply(document, arguments); };
	}
}());


(function(){
	"use strict";
	
	if(!("textContent" in Element.prototype)){
		var interfaces = "Element Text HTMLDocument HTMLCommentElement".split(" ");
		var haveText   = {3:1, 8:1, 4:1, 7:1};
		var haveNull   = {9:1, 10:1, 12:1};
		var srcTags    = {SCRIPT:1, STYLE:1};
		for(var I, i = 0; i < 4; ++i){
			I = window[interfaces[i]];
			I && Object.defineProperty(I.prototype, "textContent", {
				get: function(){ return getText(this); },
				set: function(input){
					var type = this.nodeType;
					
					/** Text nodes: set nodeValue */
					if(haveText[type])
						this.nodeValue = input;
					
					/** For everything that isn't a document, DOCTYPE or notation */
					else if(!haveNull[type]){
						var name = this.nodeName;
						
						/** IE8 throws a runtime error trying to set the innerHTML of a <style> element */
						if("STYLE" === name)
							this.styleSheet.cssText = input;
						
						/** Scripts have a similar issue */
						else if(srcTags[name])
							this.text = input;
						
						else this.innerText = input;
					}
				},
			});
		}
		
		
		function getText(node){
			var type = node.nodeType;
			
			/** Return `nodeValue` if input is a text node, comment, CDATA section, or processing instruction */
			if(haveText[type])
				return node.nodeValue;
			
			/** Return null for documents, DOCTYPE declarations, and notations */
			if(haveNull[type])
				return null;
			
			/** Use the innerHTML property of <script> and <style> tags */
			var name = node.nodeName;
			if(name && srcTags[name])
				return node.innerHTML;
			
			
			/** Everything else: Concatenate the textContent of each child node, except comments and processing instructions */
			var result   = "";
			var children = node.childNodes;
			for(var i = 0, l = children.length; i < l; ++i){
				var child = children[i];
				if(child.nodeType !== 7 && child.nodeType !== 8)
					result += child.textContent;
			}
			
			return result;
		}
	}	
}());


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

/* HTML5 Shiv 3.7.3 */
!function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=t.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=t.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),t.elements=c+" "+a,j(b)}function f(a){var b=s[a[q]];return b||(b={},r++,a[q]=r,s[r]=b),b}function g(a,c,d){if(c||(c=b),l)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():p.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||o.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),l)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return t.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(t,b.frag)}function j(a){a||(a=b);var d=f(a);return!t.shivCSS||k||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||i(a,d),a}var k,l,m="3.7.3",n=a.html5||{},o=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q="_html5shiv",r=0,s={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",k="hidden"in a,l=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){k=!0,l=!0}}();var t={elements:n.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:m,shivCSS:n.shivCSS!==!1,supportsUnknownElements:l,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=t,j(b),"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:this,document);


/** ChildNode.remove */
if(!("remove" in Element.prototype)){
	Element.prototype.remove = function(){
		if(this.parentNode)
			this.parentNode.removeChild(this);
	};
}


/** DOMTokenList */
!function(){"use strict";var n,r,t,e,i=window,o=document,u=Object,f=null,a=!0,c=!1,l=" ",s="Element",d="create"+s,h="DOMTokenList",m="__defineGetter__",p="defineProperty",v="class",g="List",y=v+g,w="rel",L=w+g,_="div",b="length",j="contains",S="apply",k="HTML",E=("item "+j+" add remove toggle toString toLocaleString").split(l),A=E[2],C=E[3],M=E[4],N="prototype",O=p in u||m in u[N]||f,T=function(n,r,t,e){u[p]?u[p](n,r,{configurable:c===O?a:!!e,get:t}):n[m](r,t)},x=function(r,t){var e=this,i=[],o={},f=0,s=0,d=function(){if(f>=s)for(;f>s;++s)(function(n){T(e,n,function(){return h(),i[n]},c)})(s)},h=function(){var n,e,u=arguments,c=/\s+/;if(u[b])for(e=0;e<u[b];++e)if(c.test(u[e]))throw n=new SyntaxError('String "'+u[e]+'" '+j+" an invalid character"),n.code=5,n.name="InvalidCharacterError",n;for(i=(""+r[t]).replace(/^\s+|\s+$/g,"").split(c),""===i[0]&&(i=[]),o={},e=0;e<i[b];++e)o[i[e]]=a;f=i[b],d()};return h(),T(e,b,function(){return h(),f}),e[E[6]]=e[E[5]]=function(){return h(),i.join(l)},e.item=function(n){return h(),i[n]},e[j]=function(n){return h(),!!o[n]},e[A]=function(){h[S](e,n=arguments);for(var n,u,c=0,s=n[b];s>c;++c)u=n[c],o[u]||(i.push(u),o[u]=a);f!==i[b]&&(f=i[b]>>>0,r[t]=i.join(l),d())},e[C]=function(){h[S](e,n=arguments);for(var n,u={},c=0,s=[];c<n[b];++c)u[n[c]]=a,delete o[n[c]];for(c=0;c<i[b];++c)u[i[c]]||s.push(i[c]);i=s,f=s[b]>>>0,r[t]=i.join(l),d()},e[M]=function(r,t){return h[S](e,[r]),n!==t?t?(e[A](r),a):(e[C](r),c):o[r]?(e[C](r),c):(e[A](r),a)},function(n,r){if(r)for(var t=0;7>t;++t)r(n,E[t],{enumerable:c})}(e,u[p]),e},D=function(n,r,t){T(n[N],r,function(){var n,e=this,i=m+p+r;if(e[i])return n;if(e[i]=a,c===O){for(var u,f=D.mirror=D.mirror||o[d](_),l=f.childNodes,s=l[b],h=0;s>h;++h)if(l[h]._R===e){u=l[h];break}u||(u=f.appendChild(o[d](_))),n=x.call(u,e,t)}else n=new x(e,t);return T(e,r,function(){return n}),delete e[i],n},a)};if(i[h])r=o[d](_)[y],N=i[h][N],r[A][S](r,E),2>r[b]&&(t=N[A],e=N[C],N[A]=function(){for(var n=0,r=arguments;n<r[b];++n)t.call(this,r[n])},N[C]=function(){for(var n=0,r=arguments;n<r[b];++n)e.call(this,r[n])}),r[M](g,c)&&(N[M]=function(r,t){var e=this;return e[(t=n===t?!e[j](r):t)?A:C](r),!!t});else{if(O)try{T({},"support")}catch(G){O=c}x.polyfill=a,i[h]=x,D(i[s],y,v+"Name"),D(i[k+"Link"+s],L,w),D(i[k+"Anchor"+s],L,w),D(i[k+"Area"+s],L,w)}}();


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

/* getOffsetTop */
var getOffsetTop = function (el) {
  var location = 0;
  
  if (el.offsetParent) {
    do {
      location += el.offsetTop;
      el = el.offsetParent;
    } while (el);
  }
  return location >= 0 ? location : 0;
};

/* getOffsetLeft */
var getOffsetLeft = function (el) {
  var location = 0;

  if (el.offsetParent) {
    do {
      location += el.offsetLeft;
      el = el.offsetParent;
    } while (el);
  }
  return location >= 0 ? location : 0;
};

/* get elements size */
// 1. outer sizes: content + padding + border + margin
// 2. offset sizes: content + padding + border
// 3. client sizes: content + padding

// 1. outer size //
function getOuterWidth(el) {
  var box = el.getBoundingClientRect();
  return box.width || (box.right - box.left);
}

function getOuterHeight(el) {
  var box = el.getBoundingClientRect();
  return box.height || (box.bottom - box.top);
}

// 2. offset size //
// http://vadikom.com/dailies/offsetwidth-offsetheight-useless-in-ie9-firefox4/
function getOffsetWidth(el) { return _getOffset(el); }
function getOffsetHeight(el) { return _getOffset(el, true); }

function _getOffset(el, height) {
  var cStyle = el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.getComputedStyle
    && el.ownerDocument.defaultView.getComputedStyle(el, null),
    ret = cStyle && cStyle.getPropertyValue(height ? 'height' : 'width') || '';
  if (ret && ret.indexOf('.') > -1) {
    ret = parseFloat(ret)
      + parseInt(cStyle.getPropertyValue(height ? 'padding-top' : 'padding-left'))
      + parseInt(cStyle.getPropertyValue(height ? 'padding-bottom' : 'padding-right'))
      + parseInt(cStyle.getPropertyValue(height ? 'border-top-width' : 'border-left-width'))
      + parseInt(cStyle.getPropertyValue(height ? 'border-bottom-width' : 'border-right-width'));
  } else {
    ret = height ? el.offsetHeight : el.offsetWidth;
  }
  return ret;
}

// 3. client size: el.clientWidth & el.clientHeight

// ** get & set styles ** //
function toCamelCase(str) {
  return str.replace(/-([a-z])/ig, function( all, letter ) {
    return letter.toUpperCase();
  });
}

function css(el, css, value) {
  var cssType = typeof css,
      valueType = typeof value,
      elStyle = el.style;

  if (cssType !== "undefined" && valueType === "undefined") {
    if (cssType === "object") {
      // set style info
      for (var prop in css) {
        if (css.hasOwnProperty(prop)) {
          elStyle[toCamelCase(prop)] = css[prop];
        }
      }
    } else if (cssType === "string") {
      // get style info for specified property
      return getStyle(el, css);
    } else {
      throw { message: "Invalid parameter passed to css()" };
    }

  } else if (cssType === "string" && valueType === "string") {
    elStyle[toCamelCase(css)] = value;

  } else {
    throw { message: "Invalid parameters passed to css()" };
  }
}


/**
  * IE8
  */
// @codekit-prepend "../bower_components/fix-ie/src/IE8-child-elements.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-getComputedStyle.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-offsets.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-addEventListener.js";
// codekit-prepend "components/IE8-addEventListener.js";
// @codekit-prepend "../bower_components/fix-ie/src/text-content.js";


// codekit-prepend "../bower_components/es5-shim/es5-shim.js";
// @codekit-prepend "../bower_components/fix-ie/src/es5-arrays.js";
// @codekit-prepend "../bower_components/fix-ie/src/es5-methods.js";
// @codekit-prepend "components/es5-function.bind.js";
// @codekit-prepend "components/es5-object.keys.js";
// @codekit-prepend "../bower_components/fix-ie/src/html5-shiv.js";
// @codekit-prepend "../bower_components/fix-ie/src/remove.js";
// @codekit-prepend "../bower_components/fix-ie/src/token-list.js";
// @codekit-prepend "../bower_components/fix-ie/src/version-flags.js";


// @codekit-prepend "components/DOM.ready.js";
// @codekit-prepend "components/extend.js";
// @codekit-prepend "components/isInViewport.js";
// @codekit-prepend "components/getSupportedProp.js";
// @codekit-prepend "components/getOffsetTop.js";
// @codekit-prepend "components/getOffsetLeft.js";
// @codekit-prepend "components/getElementSize.js";
// @codekit-prepend "components/css.js";


