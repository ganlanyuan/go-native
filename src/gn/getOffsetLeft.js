// getOffsetLeft
// @require "/src/gn/base.js"

gn.getOffsetLeft = function (el) {
  var rect = el.getBoundingClientRect(),
      left = rect.left + document.body.scrollLeft;
  return Math.round(left);
};