// Element.childElementCount

(function () {
  "use strict";

  if (!("childElementCount" in document.documentElement)) {
    Object.defineProperty(Element.prototype, "childElementCount", {
      get: function(){
        for(var c = 0, nodes = this.children, i = 0, l = nodes.length; i < l; ++i) {
          if(nodes[i].nodeType === 1) { ++c; }
        }
        return c;
      }
    });
  }
})();