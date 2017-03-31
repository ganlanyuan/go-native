export function getOffsetLeft(el) {
  return el.getBoundingClientRect().left + document.documentElement.scrollLeft;
}