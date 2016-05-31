// unwrap
// @require "/src/gn/base.js"
// @require "/src/gn/isNodeList.js"

gn.unwrap = function (els) {
  var elsNew = (gn.isNodeList(els)) ? els : [els];
  for (var i = elsNew.length; i--;) {
    var el = elsNew[i];

    // get the element's parent node
    var parent = el.parentNode;
    
    // move all children out of the element
    while (el.firstChild) { 
      parent.insertBefore(el.firstChild, el); 
    }
    
    // remove the empty element
    parent.removeChild(el);
  }
};