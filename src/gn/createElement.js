// createElement
// @require "/src/gn/base.js"

gn.createElement = function(obj) {
  if (!obj || !obj.tagName) {
    throw { message : "Invalid argument" };
  }

  var el = document.createElement(obj.tagName);
  obj.id && (el.id = obj.id);
  obj.className && (el.className = obj.className);
  obj.html && (el.innerHTML = obj.html);
  
  if (typeof obj.attributes !== "undefined") {
    var attr = obj.attributes,
      prop;

    for (prop in attr) {
      if (attr.hasOwnProperty(prop)) {
        el.setAttribute(prop, attr[prop]);
      }
    }
  }

  if (typeof obj.children !== "undefined") {
    var child, i = 0;

    while (child = obj.children[i++]) {
      el.appendChild(createElement(child));
    }
  }

  return el;
};

// var el = gn.createElement({
//  tagName: 'div',
//  id: 'foo',
//  className: 'foo',
//  children: [{
//    tagName: 'div',
//    html: '<b>Hello, creatElement</b>',
//    attributes: {
//      'am-button': 'primary'
//    }
//  }]
// });