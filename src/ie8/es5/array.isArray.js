// Array.isArray
Array.isArray = Array.isArray || function(obj){
  return "[object Array]" === Object.prototype.toString.call(obj);
};