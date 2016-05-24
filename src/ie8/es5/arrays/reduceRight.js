// reduceRight 

if(!Array.prototype.reduceRight){
	
	Array.prototype.reduceRight = function(fn){
		"use strict";
		
		if(this === null) {
			throw new TypeError("Array.prototype.reduce called on null or undefined");
		}
		
		if("function" !== typeof fn) {
			throw new TypeError(fn + " is not a function");
		}
		
		var t = Object(this), len = t.length >>> 0, k = len - 1, value;
		if(arguments.length >= 2) {
			value = arguments[1];
		} else {
			while(k >= 0 && !(k in t)) { k--; }
			if(k < 0) {
				throw new TypeError("Reduce of empty array with no initial value");
			}
			value = t[k--];
		}
		
		for(; k >= 0; k--) {
			if(k in t) { value = fn(value, t[k], k, t); }
		}
		return value;
	};
}
