import * as gn from "../../src/go-native";

function success(el) { el.className = 'success'; }
function fail(el) { el.className = 'fail'; }

var doc = document, win = window;

/*
 * preventDefault
 */
function preventDefaultTest() {
  var display = doc.getElementById('preventDefault'),
      link = doc.getElementById('preventDefault-link'),
      a = 0;

  function onclick(e) { 
    e.preventDefault();
    a += 1; 
  }

  if (Element.prototype.addEventListener) {
    link.addEventListener('click', onclick);
  } else {
    link.attachEvent('onclick', onclick);
  }

  var event;
  if (doc.createEvent) {
    event = doc.createEvent('Event');
    event.initEvent('click', true, true);
    // event = new MouseEvent('click', {
    //   'view': window,
    //   'bubbles': true,
    //   'cancelable': true
    // });
    link.dispatchEvent(event);
  } else {
    event = doc.createEventObject();
    link.fireEvent('onclick', event);
  }

  if (a === 1) {
    success(display);
  } else {
    fail(display);
  }
}

/*
 * stopPropagation
 */
function stopPropagationTest() {
  var display = doc.getElementById('stopPropagation'),
      body = doc.getElementsByTagName('BODY')[0],
      a = 0;

  function elementOnclick(e) { 
    e.stopPropagation();
    a += 1; 
  }
  function bodyOnclick(e) {
    a += 10;
  }

  if (Element.prototype.addEventListener) {
    display.addEventListener('click', elementOnclick);
    body.addEventListener('click', bodyOnclick);
  } else {
    display.attachEvent('onclick', elementOnclick);
    body.attachEvent('onclick', bodyOnclick);
  }

  var event;
  if (doc.createEvent) {
    event = doc.createEvent('Event');
    event.initEvent('click', true, true);
    // event = new MouseEvent('click', {
    //   'view': window,
    //   'bubbles': true,
    //   'cancelable': true
    // });
    display.dispatchEvent(event);
  } else {
    event = doc.createEventObject();
    display.fireEvent('onclick', event);
  }

  if (a === 1) {
    success(display);
  } else {
    fail(display);
  }
}

/*
 * addEventListener & removeEventListener
 */
function eventListenerTest() {
  var displayAdd = doc.getElementById('addEventListener'),
      displayRemove = doc.getElementById('removeEventListener'),
      body = doc.getElementsByTagName('BODY')[0],
      a = 0,
      event;

  function bodyOnclick(e) {
    a += 1;
  }

  if (doc.createEvent) {
    event = doc.createEvent('Event');
    event.initEvent('click', true, true);
    // event = new MouseEvent('click', {
    //   'view': window,
    //   'bubbles': true,
    //   'cancelable': true
    // });
  } else {
    event = doc.createEventObject();
  }

  if (Element.prototype.addEventListener) {
    body.addEventListener('click', bodyOnclick);

    if (doc.createEvent) {
      body.dispatchEvent(event);
    } else {
      body.fireEvent('onclick', event);
    }

    if (a === 1) {
      success(displayAdd);
    } else {
      fail(displayAdd);
    }
  } else {
    fail(displayAdd);
  }

  if (Element.prototype.removeEventListener) {
    body.removeEventListener('click', bodyOnclick);

    if (doc.createEvent) {
      body.dispatchEvent(event);
    } else {
      body.fireEvent('onclick', event);
    }

    if (a === 1) {
      success(displayRemove);
    } else {
      fail(displayRemove);
    }
  } else {
    fail(displayRemove);
  }
}

/*
 * innerWidth
 */
function innerWidthTest() {
  var display = doc.getElementById('innerWidth'),
      element = doc.getElementById('innerWidth-element');

  element.style.cssText = 'position: fixed; width: 100%; height: 100px;';
  if(win.innerWidth && win.innerWidth === element.clientWidth) {
    success(display);
  } else {
    fail(display);
  }
}

/*
 * innerHeight
 */
function innerHeightTest() {
  var display = doc.getElementById('innerHeight'),
      element = doc.getElementById('innerHeight-element');

  element.style.cssText = 'position: fixed; width: 100px; height: 100%;';

  if(win.innerHeight && win.innerHeight === element.clientHeight) {
    success(display);
  } else {
    fail(display);
  }
}

/*
 * pageXOffset
 */
function pageXOffsetTest() {
  var display = doc.getElementById('pageXOffset'),
      body = document.getElementsByTagName("BODY")[0];

  body.style.cssText = 'width: 120%;';
  window.scrollTo(30, 0);
  if ('pageXOffset' in window && window.pageXOffset === 30) {
    success(display);
  } else {
    fail(display);
  }

  window.scrollTo(0, 0);
  body.style.cssText = '';
}

/*
 * pageYOffset
 */
function pageYOffsetTest() {
  var display = doc.getElementById('pageYOffset'),
      body = document.getElementsByTagName("BODY")[0];

  body.style.cssText = 'min-height: 5000px;';
  window.scrollTo(0, 30);
  if ('pageYOffset' in window && window.pageYOffset === 30) {
    success(display);
  } else {
    fail(display);
  }

  window.scrollTo(0, 0);
  body.style.cssText = '';
}

/*
 * addEventListener & removeEventListener
 */

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
 * getWidth
 */
function getWidthTest() {
  var display = doc.getElementById('getWidth'),
      element = doc.getElementById('getWidth-element');

  if (gn.getWidth) {
    var width = 300, 
        padding = 3, 
        height = 200, 
        fontSize = 16,
        expectedWidth = width - (padding * fontSize) * 2;

    element.style.cssText = 'width: ' + width + 'px; padding: ' + padding + 'em; height: ' + height + 'px; font-size: ' + fontSize + 'px; box-sizing: border-box;';

    if (gn.getWidth(element) === expectedWidth) {
      success(display);
    } else {
      fail(display);
    }
  }
}

/*
 * getHeight
 */
function getHeightTest() {
  var display = doc.getElementById('getHeight'),
      element = doc.getElementById('getHeight-element');

  if (gn.getHeight) {
    var height = 300, 
        padding = 3, 
        height = 200, 
        fontSize = 16,
        expectedHeight = height - (padding * fontSize) * 2;

    element.style.cssText = 'height: ' + height + 'px; padding: ' + padding + 'em; height: ' + height + 'px; font-size: ' + fontSize + 'px; box-sizing: border-box;';

    if (gn.getHeight(element) === expectedHeight) {
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

    element.style.cssText = 'position: absolute; left: ' + left + 'px;';

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

    element.style.cssText = 'position: fixed; top: ' + top + 'px;';

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

    if (elementData.innerHTML.toLowerCase() === data.toLowerCase() &&
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

    if (elementData.innerHTML.toLowerCase() === data.toLowerCase() &&
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
 * wrap
 */
function wrapTest() {
  var display = doc.getElementById('wrap'),
      elements = doc.getElementById('wrap-element').children,
      parent = doc.querySelector('.wrap-element-parent'),
      parentClassName = parent.className,
      element1 = doc.getElementById('wrap-element-1'),
      element2 = doc.getElementById('wrap-element-2'),
      element3 = doc.getElementById('wrap-element-3');

  if (gn.wrap) {
    gn.wrap(elements, parent);

    if (element1.parentNode.className === parentClassName &&
        element2.parentNode.className === parentClassName &&
        element3.parentNode.className === parentClassName) {
      success(display);
    } else {
      fail(display);
    }
  } else {
    fail(display);
  }
}

/*
 * wrapAll
 */
function wrapAllTest() {
  var display = doc.getElementById('wrapAll'),
      parent = doc.getElementById('wrapAll-element-parent'),
      grandparent = doc.getElementById('wrapAll-element-grandparent');

  if (gn.wrapAll) {
    gn.wrapAll(grandparent.children, parent);

    if (parent.parentNode === grandparent) {
      success(display);
    } else {
      fail(display);
    }
  } else {
    fail(display);
  }
}

/*
 * unwrap
 */
function unwrapTest() {
  var display = doc.getElementById('unwrap'),
      grandparent = doc.getElementById('unwrap-element-grandparent'),
      parent = doc.getElementById('unwrap-element-parent'),
      element = doc.getElementById('unwrap-element');

  if (gn.unwrap) {
    gn.unwrap(parent);

    if (element.parentNode === grandparent) {
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
if(doc.getElementsByTagName('HTML')[0].className === 'ie8') {
  preventDefaultTest();
  stopPropagationTest();
  eventListenerTest();
  innerWidthTest();
  innerHeightTest();
  pageXOffsetTest();
  pageYOffsetTest();
  getComputedStyleElementTest();
  elementPropTest();
  textContentTest();
}

classListTest();
childNodeRemoveTest();
domReadyTest();
isInViewportTest();
getOuterWidthTest();
getOuterHeightTest();
getWidthTest();
getHeightTest();
getOffsetLeftTest();
getOffsetTopTest();
isNodeListTest();
prependTest();
appendTest();
wrapTest();
wrapAllTest();
unwrapTest();