/* get elements size */
// 1. outer size: content + padding + border + margin //
function getOuterWidth(el) {
  var width = el.offsetWidth;
  var style = el.currentStyle || getComputedStyle(el);

  width += parseInt(Length.toPx(el, style.marginLeft)) + parseInt(Length.toPx(el, style.marginRight));
  return width;
}

function getOuterHeight(el) {
  var height = el.offsetHeight;
  var style = el.currentStyle || getComputedStyle(el);

  height += parseInt(Length.toPx(el, style.marginTop)) + parseInt(Length.toPx(el, style.marginBottom));
  return height;
}

// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight