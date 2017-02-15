import "../vendors/Length.js";

export function getHeight(el) {
  var pattern = /\d/, // check if value contains digital number
      height = el.clientHeight,
      style = el.currentStyle || getComputedStyle(el),
      paddingTop = (pattern.exec(style.paddingTop) === null) ? "0px" : style.paddingTop,
      paddingBottom = (pattern.exec(style.paddingBottom) === null) ? "0px" : style.paddingBottom;

  height -= (parseInt(Length.toPx(el, paddingTop)) + parseInt(Length.toPx(el, paddingBottom)));
  return height;
}

// 1. outer size: content + padding + border + margin //
// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight
// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight
// 4. size: content