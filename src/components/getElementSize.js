/* get elements size */
// 1. outer size: content + padding + border + margin //
function getOuterWidth(el) {
  var width = el.offsetWidth,
      style = el.currentStyle || getComputedStyle(el),
      marginLeft = (style.marginLeft === 'auto') ? '0px' : style.marginLeft,
      marginRight = (style.marginRight === 'auto') ? '0px' : style.marginRight;

  width += parseInt(Length.toPx(el, marginLeft)) + parseInt(Length.toPx(el, marginRight));
  return width;
}

function getOuterHeight(el) {
  var height = el.offsetHeight,
      style = el.currentStyle || getComputedStyle(el),
      marginTop = (style.marginTop === 'auto') ? '0px' : style.marginTop,
      marginBottom = (style.marginBottom === 'auto') ? '0px' : style.marginBottom;

  height += parseInt(Length.toPx(el, marginTop)) + parseInt(Length.toPx(el, marginBottom));
  return height;
}

// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight