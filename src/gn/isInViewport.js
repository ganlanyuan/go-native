// isInViewport
// @require "/src/gn/base.js"

gn.isInViewport = function ( elem ) {
  var rect = elem.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < document.documentElement.clientHeight &&
    rect.left < document.documentElement.clientWidth
    );
};