// window.pageXOffset / window.pageYOffset / window.scrollX / window.scrollY

(function () {
  "use strict";

  if(!("pageXOffset" in window)) {
    var x = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollLeft; },
        y = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollTop;  };

    Object.defineProperty(window, "pageXOffset", {get: x});
    Object.defineProperty(window, "pageYOffset", {get: y});
    Object.defineProperty(window, "scrollX",     {get: x});
    Object.defineProperty(window, "scrollY",     {get: y});
  }
})();
