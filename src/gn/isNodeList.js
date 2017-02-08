export var isNodeList = function (el) {
  // Only NodeList has the "item()" function
  return typeof el.item !== "undefined"; 
};