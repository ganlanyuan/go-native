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

    if (cl.item(0) === 'visually-hidden' &&
        cl.contains('classList') &&
        element.className === 'visually-hidden classList add') {

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