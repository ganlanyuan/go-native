// ** Object.keys polyfill ** //
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

// ** add event listener ** //
function addEvent(o, t, fn) {
  o = o || window;
  var e = t+Math.round(Math.random()*99999999);
  if ( o.attachEvent ) {
    o['e'+e] = fn;
    o[e] = function(){
      o['e'+e]( window.event );
    };
    o.attachEvent( 'on'+t, o[e] );
  }else{
    o.addEventListener( t, fn, false );
  }
}

// ** get supported property ** //
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


// ** get elements sizes ** //
// 1. outer sizes: content + padding + border + margin
// 2. offset sizes: content + padding + border
// 3. client sizes: content + padding

// 1. outer sizes //
function getOuterWidth(el) {
  var box = el.getBoundingClientRect();
  return box.width || (box.right - box.left);
}

function getOuterHeight(el) {
  var box = el.getBoundingClientRect();
  return box.height || (box.bottom - box.top);
}

// 2. offset sizes //
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

// 3. client sizes: el.clientWidth & el.clientHeight

// ** get window sizes ** //
function getWindowWidth () {
  return document.documentElement.clientWidth;
}

function getWindowHeight() {  
  var winH, 
    d = document, 
    w = window;

  winH = w.innerHeight || 
         d.documentElement.clientHeight || 
         d.body.clientHeight;

  return winH;
}

// ** get window scroll ** //
function getWindowScrollTop() {
  return window.pageYOffset || 
         document.documentElement.scrollTop;
}

function getWindowScrollLeft() {
  return window.pageXOffset || 
         document.documentElement.scrollLeft;
}