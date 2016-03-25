/* get elements size */
// 1. outer size: content + padding + border + margin //
function getOuterWidth(el) {
  var pattern = /\d/, // check if value contains digital number
      width = el.offsetWidth,
      style = el.currentStyle || getComputedStyle(el),
      marginLeft = (pattern.exec(style.marginLeft) === null) ? '0px' : style.marginLeft,
      marginRight = (pattern.exec(style.marginRight) === null) ? '0px' : style.marginRight;

  width += parseInt(Length.toPx(el, marginLeft)) + parseInt(Length.toPx(el, marginRight));
  return width;
}

function getOuterHeight(el) {
  var pattern = /\d/, // check if value contains digital number
      height = el.offsetHeight,
      style = el.currentStyle || getComputedStyle(el),
      marginTop = (pattern.exec(style.marginTop) === null) ? '0px' : style.marginTop,
      marginBottom = (pattern.exec(style.marginBottom) === null) ? '0px' : style.marginBottom;

  height += parseInt(Length.toPx(el, marginTop)) + parseInt(Length.toPx(el, marginBottom));
  return height;
}

// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight