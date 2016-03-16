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