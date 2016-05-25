// window.innerWidth

(function () {
  "use strict";

  if(!("innerWidth" in window)){
    Object.defineProperty(window, "innerWidth",  {
      get: function(){ 
        return (document.documentElement || document.body.parentNode || document.body).clientWidth; 
      }
    });
  }
})();