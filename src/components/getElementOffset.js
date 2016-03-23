/* getOffsetLeft */
var getOffsetLeft = function (el) {
  var rect = el.getBoundingClientRect(),
      left = rect.left + document.body.scrollLeft;
  return Math.round(left);
};


/* getOffsetTop */
var getOffsetTop = function (el) {
  var rect = el.getBoundingClientRect(),
      top = rect.top + document.body.scrollTop;
  return Math.round(top);
};

