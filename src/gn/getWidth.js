import "../vendors/Length.js";

export function getWidth(el) {
  var pattern = /\d/, // check if value contains digital number
      width = el.clientWidth,
      style = el.currentStyle || getComputedStyle(el),
      paddingLeft = (pattern.exec(style.paddingLeft) === null) ? "0px" : style.paddingLeft,
      paddingRight = (pattern.exec(style.paddingRight) === null) ? "0px" : style.paddingRight;

  width -= (parseInt(Length.toPx(el, paddingLeft)) + parseInt(Length.toPx(el, paddingRight)));
  return width;
}

// 1. outer size: content + padding + border + margin
// 2. offset size: content + padding + border 
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight
// 4. size: content
