(function (exports) {
'use strict';

var isNodeList = function (el) {
  // Only NodeList has the "item()" function
  return typeof el.item !== "undefined"; 
};

var append = function(els, data) {
  var els_new = (gn.isNodeList(els)) ? els : [els], i;

  if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
    for (i = els_new.length; i--;) {
      els_new[i].appendChild(data);
    }
  } else if (typeof data === "string") {
    for (i = els_new.length; i--;) {
      els_new[i].insertAdjacentHTML("beforeend", data);
    }
  } else if (gn.isNodeList(data)) {
    var fragment = document.createDocumentFragment();
    for (i = data.length; i--;) {
      fragment.insertBefore(data[i], fragment.firstChild);
    }
    for (var j = els_new.length; j--;) {
      els_new[j].appendChild(fragment);
    }
  }
};

var createElement = function(obj) {
  if (!obj || !obj.tagName) {
    throw { message : "Invalid argument" };
  }

  var el = document.createElement(obj.tagName);
  obj.id && (el.id = obj.id);
  obj.className && (el.className = obj.className);
  obj.html && (el.innerHTML = obj.html);
  
  if (typeof obj.attributes !== "undefined") {
    var attr = obj.attributes,
      prop;

    for (prop in attr) {
      if (attr.hasOwnProperty(prop)) {
        el.setAttribute(prop, attr[prop]);
      }
    }
  }

  if (typeof obj.children !== "undefined") {
    var child, i = 0;

    while (child = obj.children[i++]) {
      el.appendChild(createElement(child));
    }
  }

  return el;
};

// var el = gn.createElement({
//  tagName: "div",
//  id: "foo",
//  className: "foo",
//  children: [{
//    tagName: "div",
//    html: "<b>Hello, creatElement</b>",
//    attributes: {
//      "am-button": "primary"
//    }
//  }]
// });

var ready = function ( fn ) {

  // Sanity check
  if ( typeof fn !== "function" ) { return; }

  // If document is already loaded, run method
  if ( document.readyState === "complete"  ) {
    return fn();
  }

  // Otherwise, wait until document is loaded
  document.addEventListener( "DOMContentLoaded", fn, false );
};

var extend = function () {
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
};

var getClosest = function (elem, selector) {

  var firstChar = selector.charAt(0);

  // Get closest match
  for ( ; elem && elem !== document; elem = elem.parentNode ) {

    // If selector is a class
    if ( firstChar === "." ) {
      if ( elem.classList.contains( selector.substr(1) ) ) {
        return elem;
      }
    }

    // If selector is an ID
    if ( firstChar === "#" ) {
      if ( elem.id === selector.substr(1) ) {
        return elem;
      }
    } 

    // If selector is a data attribute
    if ( firstChar === "[" ) {
      if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
        return elem;
      }
    }

    // If selector is a tag
    if ( elem.tagName.toLowerCase() === selector ) {
      return elem;
    }

  }

  return false;

};

// var elem = document.querySelector("#some-element");
// var closest = getClosest(elem, ".some-class");
// var closestLink = getClosest(elem, "a");
// var closestExcludingElement = getClosest(elem.parentNode, ".some-class");

// create a test element
var testElem = document.createElement('test');
var docElement = document.documentElement;
var defaultView = document.defaultView;
var getComputedStyle$1 = defaultView && defaultView.getComputedStyle;
var computedValueBug;
var runit = /^(-?[\d+\.\-]+)([a-z]+|%)$/i;
var convert = {};
var conversions = [1 / 25.4, 1 / 2.54, 1 / 72, 1 / 6];
var units = ['mm', 'cm', 'pt', 'pc', 'in', 'mozmm'];
var i = 6; // units.length

// add the test element to the dom
docElement.appendChild(testElem);

// test for the WebKit getComputedStyle bug
// @see http://bugs.jquery.com/ticket/10639
if (getComputedStyle$1) {
  // add a percentage margin and measure it
  testElem.style.marginTop = '1%';
  computedValueBug = getComputedStyle$1(testElem).marginTop === '1%';
}

// pre-calculate absolute unit conversions
while (i--) {
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
      unit = (value.match(runit) || [])[2],
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
    } catch (e) {
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

  if (getComputedStyle$1) {
    // FireFox, Chrome/Safari, Opera and IE9+
    value = getComputedStyle$1(elem)[prop];
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
  unit = (value.match(runit) || [])[2];
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
  } else if ((value === 'auto' || (unit && unit !== 'px')) && getComputedStyle$1) {
    // WebKit and Opera will return auto in some cases
    // Firefox will pass back an unaltered value when it can't be set, like top on a static element
    value = 0;
  } else if (unit && unit !== 'px' && !getComputedStyle$1) {
    // IE 8 and below won't convert units for us
    // try to convert using a prop that will return pixels
    // this will be accurate for everything (except font-size and some percentages)
    value = toPx(elem, value) + 'px';
  }
  return value;
}

// expose the conversion function to the window object
var Length = {
  toPx: toPx
};

var getHeight = function (el) {
  var pattern = /\d/, // check if value contains digital number
      height = el.clientHeight,
      style = el.currentStyle || getComputedStyle(el),
      paddingTop = (pattern.exec(style.paddingTop) === null) ? "0px" : style.paddingTop,
      paddingBottom = (pattern.exec(style.paddingBottom) === null) ? "0px" : style.paddingBottom;

  height -= (parseInt(Length.toPx(el, paddingTop)) + parseInt(Length.toPx(el, paddingBottom)));
  return height;
};

// 1. outer size: content + padding + border + margin //
// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight
// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight
// 4. size: content

var getOffsetLeft = function (el) {
  var rect = el.getBoundingClientRect(),
      left = rect.left + document.body.scrollLeft;
  return Math.round(left);
};

var getOffsetTop = function (el) {
  var rect = el.getBoundingClientRect(),
      top = rect.top + document.body.scrollTop;
  return Math.round(top);
};

var getOuterHeight = function (el) {
  var pattern = /\d/, // check if value contains digital number
      height = el.offsetHeight,
      style = el.currentStyle || getComputedStyle(el),
      marginTop = (pattern.exec(style.marginTop) === null) ? '0px' : style.marginTop,
      marginBottom = (pattern.exec(style.marginBottom) === null) ? '0px' : style.marginBottom;

  height += parseInt(Length.toPx(el, marginTop)) + parseInt(Length.toPx(el, marginBottom));
  return height;
};

// 1. outer size: content + padding + border + margin //
// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight

var getOuterWidth = function (el) {
  var pattern = /\d/, // check if value contains digital number
      width = el.offsetWidth,
      style = el.currentStyle || getComputedStyle(el),
      marginLeft = (pattern.exec(style.marginLeft) === null) ? '0px' : style.marginLeft,
      marginRight = (pattern.exec(style.marginRight) === null) ? '0px' : style.marginRight;

  width += parseInt(Length.toPx(el, marginLeft)) + parseInt(Length.toPx(el, marginRight));
  return width;
};

// 1. outer size: content + padding + border + margin //
// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight
// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight

var getParents = function (elem, selector) {

  var parents = [];
  if ( selector ) {
    var firstChar = selector.charAt(0);
  }

  // Get matches
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( selector ) {

      // If selector is a class
      if ( firstChar === '.' ) {
        if ( elem.classList.contains( selector.substr(1) ) ) {
          parents.push( elem );
        }
      }

      // If selector is an ID
      if ( firstChar === '#' ) {
        if ( elem.id === selector.substr(1) ) {
          parents.push( elem );
        }
      }

      // If selector is a data attribute
      if ( firstChar === '[' ) {
        if ( elem.hasAttribute( selector.substr(1, selector.length - 1) ) ) {
          parents.push( elem );
        }
      }

      // If selector is a tag
      if ( elem.tagName.toLowerCase() === selector ) {
        parents.push( elem );
      }

    } else {
      parents.push( elem );
    }

  }

  // Return parents if any exist
  if ( parents.length === 0 ) {
    return null;
  } else {
    return parents;
  }

};

// var elem = document.querySelector('#some-element');
// var parents = getParents(elem, '.some-class');
// var allParents = getParents(elem.parentNode);

var getParentsUntil = function (elem, parent, selector) {

  var parents = [];
  if ( parent ) {
    var parentType = parent.charAt(0);
  }
  if ( selector ) {
    var selectorType = selector.charAt(0);
  }

    // Get matches
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        // Check if parent has been reached
        if ( parent ) {

        // If parent is a class
        if ( parentType === '.' ) {
          if ( elem.classList.contains( parent.substr(1) ) ) {
            break;
          }
        }

        // If parent is an ID
        if ( parentType === '#' ) {
          if ( elem.id === parent.substr(1) ) {
            break;
          }
        }

        // If parent is a data attribute
        if ( parentType === '[' ) {
          if ( elem.hasAttribute( parent.substr(1, parent.length - 1) ) ) {
            break;
          }
        }

        // If parent is a tag
        if ( elem.tagName.toLowerCase() === parent ) {
          break;
        }

      }

      if ( selector ) {

        // If selector is a class
        if ( selectorType === '.' ) {
          if ( elem.classList.contains( selector.substr(1) ) ) {
            parents.push( elem );
          }
        }

        // If selector is an ID
        if ( selectorType === '#' ) {
          if ( elem.id === selector.substr(1) ) {
            parents.push( elem );
          }
        }

        // If selector is a data attribute
        if ( selectorType === '[' ) {
          if ( elem.hasAttribute( selector.substr(1, selector.length - 1) ) ) {
            parents.push( elem );
          }
        }

        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
          parents.push( elem );
        }

      } else {
        parents.push( elem );
      }

    }

    // Return parents if any exist
    if ( parents.length === 0 ) {
      return null;
    } else {
      return parents;
    }

};

// Examples
// var elem = document.querySelector('#some-element');
// var parentsUntil = getParentsUntil(elem, '.some-class');
// var parentsUntilByFilter = getParentsUntil(elem, '.some-class', '[data-something]');
// var allParentsUntil = getParentsUntil(elem);
// var allParentsExcludingElem = getParentsUntil(elem.parentNode);

var getSiblings = function (elem) {
  var siblings = [];
  var sibling = elem.parentNode.firstChild;
  for ( ; sibling; sibling = sibling.nextSibling ) {
    if ( sibling.nodeType === 1 && sibling !== elem ) {
      siblings.push( sibling );
    }
  }
  return siblings;
};

// var elem = document.querySelector('#some-element');
// var siblings = getSiblings(elem);

var getSupportedProp = function (proparray){
  var root = document.documentElement;
  for (var i=0; i<proparray.length; i++){
    if (proparray[i] in root.style){
      return proparray[i];
    }
  }
};

// var getTD = gn.getSupportedProp(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration']),
// getTransform = gn.getSupportedProp(['transform', 'WebkitTransform', 'MozTransform', 'OTransform']);

var getWidth = function (el) {
  var pattern = /\d/, // check if value contains digital number
      width = el.clientWidth,
      style = el.currentStyle || getComputedStyle(el),
      paddingLeft = (pattern.exec(style.paddingLeft) === null) ? '0px' : style.paddingLeft,
      paddingRight = (pattern.exec(style.paddingRight) === null) ? '0px' : style.paddingRight;

  width -= (parseInt(Length.toPx(el, paddingLeft)) + parseInt(Length.toPx(el, paddingRight)));
  return width;
};

// 1. outer size: content + padding + border + margin
// 2. offset size: content + padding + border 
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight
// 4. size: content

var indexOf = function (array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) { return i; }
  }
  return -1;
};

var isInViewport = function ( elem ) {
  var rect = elem.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < document.documentElement.clientHeight &&
    rect.left < document.documentElement.clientWidth
    );
};

// forEach

if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}

// addEventListener
// removeEventListener
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility

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

// https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame

var optimizedResize = (function() {

  var callbacks = [],
  running = false;

  // fired on resize event
  function resize() {

    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }

  }

  // run the actual callbacks
  function runCallbacks() {

    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {

    if (callback) {
      callbacks.push(callback);
    }

  }

  return {
    // public method to add additional callback
    add: function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    }
  };
}());

// start process
// gn.optimizedResize.add(function() {
//   console.log('Resource conscious resize callback!')
// });

var prepend = function(els, data) {
  var els_new = (gn.isNodeList(els)) ? els : [els], i;

  if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
    for (i = els_new.length; i--;) {
      els_new[i].insertBefore(data, els_new[i].firstChild);
    }
  } else if (typeof data === "string") {
    for (i = els_new.length; i--;) {
      els_new[i].insertAdjacentHTML('afterbegin', data);
    }
  } else if (gn.isNodeList(data)) {
    var fragment = document.createDocumentFragment();
    for (i = data.length; i--;) {
      fragment.insertBefore(data[i], fragment.firstChild);
    }
    for (var j = els_new.length; j--;) {
      els_new[j].insertBefore(fragment, els_new[j].firstChild);
    }
  }
};

var unwrap = function (els) {
  var elsNew = (gn.isNodeList(els)) ? els : [els];
  for (var i = elsNew.length; i--;) {
    var el = elsNew[i];

    // get the element's parent node
    var parent = el.parentNode;
    
    // move all children out of the element
    while (el.firstChild) { 
      parent.insertBefore(el.firstChild, el); 
    }
    
    // remove the empty element
    parent.removeChild(el);
  }
};

var wrap = function (els, obj) {
    var elsNew = (gn.isNodeList(els)) ? els : [els];
  // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `wrapper` below).
  for (var i = elsNew.length; i--;) {
      var wrapper = (i > 0) ? obj.cloneNode(true) : obj,
          el = elsNew[i];

      // Cache the current parent and sibling.
      var parent = el.parentNode,
          sibling = el.nextSibling;

      // Wrap the element (is automatically removed from its current parent).
      wrapper.appendChild(el);

      // If the element had a sibling, insert the wrapper before
      // the sibling to maintain the HTML structure; otherwise, just
      // append it to the parent.
      if (sibling) {
          parent.insertBefore(wrapper, sibling);
      } else {
          parent.appendChild(wrapper);
      }
  }
};

var wrapAll = function (els, wrapper) {
  // Cache the current parent and sibling of the first element.
  var el = els.length ? els[0] : els,
      parent  = el.parentNode,
      sibling = el.nextSibling;

  // Wrap all elements (if applicable). Each element is
  // automatically removed from its current parent and from the elms
  // array.
  for (var i = 0; i < els.length; i++) {
    wrapper.appendChild(els[i]);
  }
  
  // If the first element had a sibling, insert the wrapper before the
  // sibling to maintain the HTML structure; otherwise, just append it
  // to the parent.
  if (sibling !== els[1]) {
    parent.insertBefore(wrapper, sibling);
  } else {
    parent.appendChild(wrapper);
  }
};

var gn$1 = (function (g) {
  g.isNodeList = isNodeList;
  g.append = append;
  g.createElement = createElement;
  g.ready = ready;
  g.extend = extend;
  g.getClosest = getClosest;
  g.getHeight = getHeight;
  g.getOffsetLeft = getOffsetLeft;
  g.getOffsetTop = getOffsetTop;
  g.getOuterHeight = getOuterHeight;
  g.getOuterWidth = getOuterWidth;
  g.getParents = getParents;
  g.getParentsUntil = getParentsUntil;
  g.getSiblings = getSiblings;
  g.getSupportedProp = getSupportedProp;
  g.getWidth = getWidth;
  g.indexOf = indexOf;
  g.isInViewport = isInViewport;
  g.optimizedResize = optimizedResize;
  g.prepend = prepend;
  g.unwrap = unwrap;
  g.wrap = wrap;
  g.wrapAll = wrapAll;

  return g;
})(window.gn || {});

exports.gn = gn$1;

}((this.gn = this.gn || {})));
//# sourceMappingURL=go-native.js.map
