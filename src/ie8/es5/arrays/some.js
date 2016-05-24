// Every 

if(!Array.prototype.some){
	
	Array.prototype.some = function(fn){
		"use strict";
		
		if(this === null) {
			throw new TypeError("Array.prototype.some called on null or undefined");
		}
		
		if(typeof fn !== "function") {
			throw new TypeError();
		}
		
		var t = Object(this);
		var l = t.length >>> 0;
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for(var i = 0; i < l; i++) {
			if(i in t && fn.call(thisArg, t[i], i, t)) { return true; }
		}
		return false;
	};
}