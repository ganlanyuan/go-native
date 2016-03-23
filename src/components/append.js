// *** append *** //
var append = function(els, data) {
  var els_new = (isNodeList(els)) ? els : [els];

  if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
    for (var i = els_new.length; i--;) {
      els_new[i].appendChild(data);
    }
  } else if (typeof data === "string") {
    for (var i = els_new.length; i--;) {
      els_new[i].insertAdjacentHTML('afterbegin', data);
    }
  }
};

