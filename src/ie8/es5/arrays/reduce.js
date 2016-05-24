// reduce

if(!Array.prototype.reduce){
	Array.prototype.reduce = function(fn){
		"use strict";
		
		if(this === null) {
			throw new TypeError("Array.prototype.reduce called on null or undefined");
		}
		
		if("function" !== typeof fn) {
			throw new TypeError(fn + " is not a function");
		}
		
		var t = Object(this), len = t.length >>> 0, k = 0, value;
		if(2 === arguments.length) {
			value = arguments[1];
		} else{
			while(k < len && !(k in t)) { k++; }
			if(k >= len) {
				throw new TypeError("Reduce of empty array with no initial value");
			}
			value = t[k++];
		}
		
		for(; k < len; k++) {
			if(k in t) { value = fn(value, t[k], k, t); }
		}
		
		return value;
	};
}