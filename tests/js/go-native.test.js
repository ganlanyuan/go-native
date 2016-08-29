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
 * getOuterWidth
 */
function getOuterWidthTest() {
  var display = doc.getElementById('getOuterWidth'),
      element = doc.getElementById('getOuterWidth-element');

  if (gn.getOuterWidth) {
    var width = 300, 
        padding = 30, 
        border = 2, 
        margin = 10, 
        height = 20, 
        outerWidth = width + (padding + border + margin) * 2;

    element.style.cssText = 'width: ' + width + 'px; padding: ' + padding + 'px; border: ' + border + 'px solid #f5f5f5; margin: ' + margin + 'px; height: ' + height + 'px;';

    if (gn.getOuterWidth(element) === outerWidth) {
      success(display);
    } else {
      fail(display);
    }
  }
}

/*
 * getOuterHeight
 */
function getOuterHeightTest() {
  var display = doc.getElementById('getOuterHeight'),
      element = doc.getElementById('getOuterHeight-element');

  if (gn.getOuterHeight) {
    var width = 300, 
        padding = 30, 
        border = 2, 
        margin = 10, 
        height = 20, 
        outerHeight = height + (padding + border + margin) * 2;

    element.style.cssText = 'width: ' + width + 'px; padding: ' + padding + 'px; border: ' + border + 'px solid #f5f5f5; margin: ' + margin + 'px; height: ' + height + 'px;';

    if (gn.getOuterHeight(element) === outerHeight) {
      success(display);
    } else {
      fail(display);
    }
  }
}

/*
 * getOffsetLeft
 */
function getOffsetLeftTest() {
  var display = doc.getElementById('getOffsetLeft'),
      element = doc.getElementById('getOffsetLeft-element');

  if (gn.getOffsetLeft) {
    var left = 300, 
        offsetLeft = left;

    element.style.cssText = 'left: ' + left + 'px;';

    if (gn.getOffsetLeft(element) === offsetLeft) {
      success(display);
    } else {
      fail(display);
    }
  }
}

/*
 * getOffsetTop
 */
function getOffsetTopTest() {
  var display = doc.getElementById('getOffsetTop'),
      element = doc.getElementById('getOffsetTop-element');

  if (gn.getOffsetTop) {
    var top = 40, 
        offsetTop = top;

    element.style.cssText = 'top: ' + top + 'px;';

    if (gn.getOffsetTop(element) === offsetTop) {
      success(display);
    } else {
      fail(display);
    }
  }
}

/*
 * isNodeList
 */
function isNodeListTest() {
  var display = doc.getElementById('isNodeList'),
      nodeList = doc.getElementById('isNodeList-element').children,
      string = 'string',
      number = 34,
      array = [2, 13, 45, 0],
      object = {left: 100, right: 200},
      node = doc.getElementById('isNodeList-element');

  if (gn.isNodeList &&
      gn.isNodeList(nodeList) &&
      !gn.isNodeList(string) &&
      !gn.isNodeList(number) &&
      !gn.isNodeList(array) &&
      !gn.isNodeList(object) &&
      !gn.isNodeList(node)) {
    success(display);
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
      element.childElementCount === count) {
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
      hiddenTop = doc.getElementById('isInViewport-hidden-top'),
      hiddenBottom = doc.getElementById('isInViewport-hidden-bottom'),
      hiddenLeft = doc.getElementById('isInViewport-hidden-left'),
      hiddenRight = doc.getElementById('isInViewport-hidden-right');

  visible.style.cssText = "position: fixed; left: 0px; top: 10px; width: 10px; height: 20px;";
  hiddenTop.style.cssText = "position: fixed; left: 0px; top: -20px; width: 200px; height: 20px; background: red;";
  hiddenBottom.style.cssText = "position: fixed; left: 0px; bottom: -20px; width: 200px; height: 20px; background: red;";
  hiddenLeft.style.cssText = "position: fixed; left: -200px; top: 10px; width: 200px; height: 20px; background: red;";
  hiddenRight.style.cssText = "position: fixed; right: -200px; top: 10px; width: 200px; height: 20px; background: red;";

  // alert(gn.isInViewport(hiddenBottom));
  if (gn.isInViewport && 
      gn.isInViewport(visible) &&
      !gn.isInViewport(hiddenTop) &&
      !gn.isInViewport(hiddenBottom) &&
      !gn.isInViewport(hiddenLeft) &&
      !gn.isInViewport(hiddenRight)) {

    success(display);
  } else {
    fail(display);
  }
}

/*
 * prepend
 */
function prependTest() {
  var display = doc.getElementById('prepend'),
      elementData = doc.getElementById('prepend-data'),
      elementNode = doc.getElementById('prepend-node'),
      elementList = doc.getElementById('prepend-list'),
      data = '<span>New element</span>',
      node = doc.getElementById('prepend-node-insert'),
      list = doc.getElementById('prepend-list-insert').children,
      listFirst = doc.getElementById('prepend-list-insert-first');

  if (gn.prepend) {
    gn.prepend(elementData, data);
    gn.prepend(elementNode, node);
    gn.prepend(elementList, list);

    if (elementData.innerHTML === data &&
        elementNode.firstChild === node &&
        elementList.firstChild === listFirst) {
      success(display);
    } else {
      fail(display);
    }
  } else {
    fail(display);
  }
}

/*
 * append
 */
function appendTest() {
  var display = doc.getElementById('append'),
      elementData = doc.getElementById('append-data'),
      elementNode = doc.getElementById('append-node'),
      elementList = doc.getElementById('append-list'),
      data = '<span>New element</span>',
      node = doc.getElementById('append-node-insert'),
      list = doc.getElementById('append-list-insert').children,
      listLast = doc.getElementById('append-list-insert-last');

  if (gn.append) {
    gn.append(elementData, data);
    gn.append(elementNode, node);
    gn.append(elementList, list);

    if (elementData.innerHTML === data &&
        elementNode.lastChild === node &&
        elementList.lastChild === listLast) {
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
domReadyTest();
textContentTest();
elementPropTest();
isInViewportTest();
getOuterWidthTest();
getOuterHeightTest();
getOffsetLeftTest();
getOffsetTopTest();
isNodeListTest();
prependTest();
appendTest();