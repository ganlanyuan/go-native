// event.pageX / event.pageY

(function () {
  "use strict";

  if(!window.MouseEvent && !("pageX" in Event.prototype)){
    Object.defineProperty(Event.prototype, "pageX", {
      get: function(){ 
        return this.clientX + window.pageXOffset; 
      }
    });
    Object.defineProperty(Event.prototype, "pageY", {
      get: function(){ 
        return this.clientY + window.pageYOffset; 
      }
    });
  }
})();