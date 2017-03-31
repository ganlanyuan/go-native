export function getOffsetTop(el) {
  return el.getBoundingClientRect().top + document.documentElement.scrollTop;
}