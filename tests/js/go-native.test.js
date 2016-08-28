function success(el) {
  el.className = 'success';
}

function fail(el) {
  el.className = 'fail';
}

var doc = document, win = window;

/*
 * getComputedStyle
 */

function getComputedStyleElementTest() {
  var element = doc.getElementById("getComputedStyle-element"),
      pseudoElement = doc.getElementById('getComputedStyle-pseudo'),
      display = doc.getElementById("getComputedStyle"),
      eleHeight = '100px',
      elePadding = '16px',
      eleMarginBottom = '10px',
      eleBorderBottomStyle = 'dashed',
      eleFontFamily = 'Arial,"Helvetica Neue",Helvetica,sans-serif',
      eleAfterContent = '"getComputedStyle"';

  element.style.cssText = "height: 100px; padding: 16px; margin-bottom: 10px; border: 1px dashed #ccc;";

  var cssProp = win.getComputedStyle(element,null);
  var cssPropPseudo = win.getComputedStyle(element, ':after');

  // console.log('height: ' + cssProp.height + '; ' + 
  //   'padding-bottom: ' + cssProp.paddingBottom + '; ' + 
  //   'margin-bottom: ' + cssProp.marginBottom + '; ' + 
  //   'border-bottom-style: ' + cssProp.borderBottomStyle + '; ' + 
  //   'font-family: ' + cssProp.fontFamily + '; ' +
  //   'pseudo-content: ' + cssPropPseudo.content);
  if (cssProp.height === eleHeight &&
      cssProp.paddingBottom === elePadding &&
      cssProp.marginBottom === eleMarginBottom &&
      cssProp.borderBottomStyle === eleBorderBottomStyle &&
      cssProp.fontFamily.indexOf('Helvetica Neue')) {

    success(display);
  } else {
    fail(display);
  }

  if (cssPropPseudo.content === eleAfterContent) {
    success(pseudoElement);
  } else {
    fail(pseudoElement);
  }
}

/*
 * classList
 */
function classListTest() {
  var element = doc.getElementById('classList-element'),
      display = doc.getElementById('classList'),
      cl = element.classList,
      a = 10;

  if (typeof cl === 'object' &&
      cl.length !== 'undefined') {

    // className: 'visually-hidden classList remove toggle toggle-remove'
    cl.add('add'); // 'visually-hidden classList remove toggle toggle-remove add'
    cl.remove('remove'); // 'visually-hidden classList toggle toggle-remove add'
    cl.toggle('toggle'); // 'visually-hidden classList toggle-remove add'
    cl.toggle('toggle-remove', a > 15); // 'visually-hidden classList add'

    var cn = element.className;

    // test all features
    if (cl.item(0) === 'visually-hidden' &&
        cl.contains('classList') &&
        cn === 'visually-hidden classList add') {

      success(display);
    } else {
      fail(display);
    }

    // test individual feature
    var clItem = doc.getElementById('classList-item'),
        clContains = doc.getElementById('classList-contains'),
        clAdd = doc.getElementById('classList-add'),
        clRemove = doc.getElementById('classList-remove'),
        clToggle = doc.getElementById('classList-toggle'),
        clToggleForce = doc.getElementById('classList-toggle-force');

    if (cl.item(0) === 'visually-hidden') { success(clItem); } else { fail(clItem); } // item
    if (cl.contains('classList')) { success(clContains); } else { fail(clContains); } // contains
    if (cn.indexOf('add') !== -1) { success(clAdd); } else { fail(clAdd); } // add
    if (cn.indexOf('remove') === -1) { success(clRemove); } else { fail(clRemove); } // remove
    if (cn.indexOf('toggle') === -1) { success(clToggle); } else { fail(clToggle); } // toggle
    if (cn.indexOf('toggle-remove') === -1) { success(clToggleForce); } else { fail(clToggleForce); } // toggle-force

  } else {
    fail(display);
  }
}

/*
 * childNode.remove()
 */
function childNodeRemoveTest() {
  var display = doc.getElementById('childNodeRemove'),
      element = doc.getElementById('childNodeRemove-element'),
      child = doc.getElementById('childNodeRemove-element-child');

  if ("remove" in Element.prototype) {
    child.remove();

    if (element.children.length === 0) {
      success(display);
    } else {
      fail(display);
    }
  } else {
    fail(display);
  }
}

/*
 * DOM.ready
 */
function domReadyTest() {
  var display = doc.getElementById('domReady'),
      order = [];

  if (gn.ready) {
    gn.ready(function () { order.push('ready'); });

    window.onload = function () {
      order.push('loaded');

      if (order.length === 2 && order[0] === 'ready') {
        success(display);
      } else {
        fail(display);
      }
    };
  } else {
    fail(display);
  }
}

/*
 * Node.textContent
 */
function elementPropTest() {
  var displayCount = doc.getElementById('childElementCount'),
      displayFirst = doc.getElementById('firstElementChild'),
      displayLast = doc.getElementById('lastElementChild'),
      displayPrevious = doc.getElementById('previousElementSibling'),
      displayNext = doc.getElementById('nextElementSibling'),
      element = doc.getElementById('elementProp'),
      count = 8,
      current = doc.getElementById('currentElement'),
      first = doc.getElementById('firstElement'),
      last = doc.getElementById('lastElement'),
      previous = doc.getElementById('previousElement'),
      next = doc.getElementById('nextElement');

  // count
  if ("childElementCount" in document.documentElement &&
      element.childElementCount === 8) {
    success(displayCount);
  } else {
    fail(displayCount);
  }

  // first
  if ("firstElementChild" in document.documentElement &&
      element.firstElementChild === first) {
    success(displayFirst);
  } else {
    fail(displayFirst);
  }

  // last
  if ("lastElementChild" in document.documentElement &&
      element.lastElementChild === last) {
    success(displayLast);
  } else {
    fail(displayLast);
  }

  // previous
  if ("previousElementSibling" in document.documentElement &&
      current.previousElementSibling === previous) {
    success(displayPrevious);
  } else {
    fail(displayPrevious);
  }

  // next
  if ("nextElementSibling" in document.documentElement &&
      current.nextElementSibling === next) {
    success(displayNext);
  } else {
    fail(displayNext);
  }
}

/*
 * Node.textContent
 */
function textContentTest() {
  var display = doc.getElementById('textContent'),
      element = doc.getElementById('textContent-element'),
      content = "textContent returns null if the element is a document, a document type, or a notation. To grab all of the text and CDATA data for the whole document, one could use document.documentElement.textContent.";

  if ("textContent" in Element.prototype &&
      element.textContent === content) {
    success(display);
  } else {
    fail(display);
  }
}

/*
 * isInViewport
 */
function isInViewportTest() {
  var display = doc.getElementById('isInViewport'),
      visible = doc.getElementById('isInViewport-visible'),
      hidden = doc.getElementById('isInViewport-hidden');

  if (gn.isInViewport && 
      gn.isInViewport(visible) &&
      !gn.isInViewport(hidden)) {

    success(display);
  } else {
    fail(display);
  }
}

/*
 * run tests
 */

getComputedStyleElementTest();
classListTest();
childNodeRemoveTest();
domReadyTest();
textContentTest();
elementPropTest();
isInViewportTest();