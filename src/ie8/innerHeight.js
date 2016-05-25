// window.innerHeight

(function () {
  "use strict";

  if(!("innerHeight" in window)){
    Object.defineProperty(window, "innerHeight", {
      get: function(){ 
        return (document.documentElement || document.body.parentNode || document.body).clientHeight; 
      }
    });
  }
})();