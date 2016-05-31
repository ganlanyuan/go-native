// getOffsetTop
// @require "/src/gn/base.js"

gn.getOffsetTop = function (el) {
  var rect = el.getBoundingClientRect(),
      top = rect.top + document.body.scrollTop;
  return Math.round(top);
};