// String.prototype.repeat
String.prototype.repeat = String.prototype.repeat || function(num) {
  return Array(num + 1).join(this);
};