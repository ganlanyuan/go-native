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
 * run tests
 */

getComputedStyleElementTest();
classListTest();
childNodeRemoveTest();