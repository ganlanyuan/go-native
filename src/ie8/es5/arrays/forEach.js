// forEach

if(!Array.prototype.forEach){

	Array.prototype.forEach = function(callback, thisArg){
		var T, k;
		
		if(this === null) {
			throw new TypeError(" this is null or not defined");
		}
		
		var O = Object(this);
		var l = O.length >>> 0;
		
		if("function" !== typeof callback) {
			throw new TypeError(callback + " is not a function");
		}
		
		if(arguments.length > 1) {
			T = thisArg;
		}
		
		k = 0;
		while(k < l){
			var kValue;
			if(k in O) {
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}