// *** getLeft *** //
var getLeft = function (el) {
  var location = 0;

  if (el.offsetParent) {
    do {
      location += el.offsetLeft;
      el = el.offsetParent;
    } while (el);
  }
  return location >= 0 ? location : 0;
};