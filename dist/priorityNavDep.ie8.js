/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document|DocumentFragment} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));


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


/**
 * IE8 
 * addEventListener
 * removeEventListener
 *
 *https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility
 *
 */
(function() {
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();

/**
  * IE8
  */
// @codekit-prepend "../bower_components/html5shiv/dist/html5shiv.js";
// @codekit-prepend "../bower_components/fix-ie/src/es5-arrays.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-child-elements.js";
// @codekit-prepend "../bower_components/fix-ie/src/IE8-offsets.js";
// @codekit-prepend "components/IE8-addEventListener.js";


