// getOuterHeight
// @require "/src/gn/base.js"
// @require "/bower_components/Units/Length.js"

gn.getOuterHeight = function (el) {
  var pattern = /\d/, // check if value contains digital number
      height = el.offsetHeight,
      style = el.currentStyle || getComputedStyle(el),
      marginTop = (pattern.exec(style.marginTop) === null) ? '0px' : style.marginTop,
      marginBottom = (pattern.exec(style.marginBottom) === null) ? '0px' : style.marginBottom;

  height += parseInt(Length.toPx(el, marginTop)) + parseInt(Length.toPx(el, marginBottom));
  return height;
};

// 2. offset size: content + padding + border //
//    el.offsetWidth  
//    el.offsetHeight

// 3. client size: content + padding
//    el.clientWidth  
//    el.clientHeight