// map

if(!Array.prototype.map){
	
	Array.prototype.map = function(fn, thisArg){
		var T, A, k;
		
		if(this === null) {
			throw new TypeError('"this" is null or not defined');
		}
		
		var O = Object(this);
		var l = O.length >>> 0;
		
		if("function" !== typeof fn) {
			throw new TypeError(fn + " is not a function");
		}
		
		if(arguments.length > 1) {
			T = thisArg;
		}
		
		A = new Array(l);
		k = 0;
		while (k < l) {
			var kValue, mappedValue;
			if(k in O) {
				kValue = O[k];
				mappedValue = fn.call(T, kValue, k, O);
				A[k] = mappedValue;
			}
			k++;
		}
		
		return A;
	};
}