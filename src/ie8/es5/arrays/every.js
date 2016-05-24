// Every 

if(!Array.prototype.every){
	
	Array.prototype.every = function(fn, thisArg){
		"use strict";
		var T, k;
		
		if(this === null) {
			throw new TypeError("'this' is null or not defined");
		}
		
		var O = Object(this);
		var l = O.length >>> 0;
		if("function" !== typeof fn) {
			throw new TypeError();
		}
		
		if(arguments.length > 1) {
			T = thisArg;
		}
		
		k = 0;
		while (k < l){
			var kValue;
			if(k in O){
				kValue = O[k];
				var testResult = fn.call(T, kValue, k, O);
				if(!testResult) { return false; }
			}
			k++;
		}
		return true;
	};
}