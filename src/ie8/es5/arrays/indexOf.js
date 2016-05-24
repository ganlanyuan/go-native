// indexOf

if(!Array.prototype.indexOf){
	
	Array.prototype.indexOf = function(searchElement, fromIndex){
		var k;
		
		if(this === null) {
			throw new TypeError('"this" is null or not defined');
		}
		
		var o = Object(this);
		var l = o.length >>> 0;
		if(l === 0) {
			return -1;
		}
		
		var n = +fromIndex || 0;
		if(Math.abs(n) === Infinity) {
			n = 0;
		}
		
		if(n >= l) {
			return -1;
		}
		k = Math.max(n >= 0 ? n : l - Math.abs(n), 0);
		
		while(k < l){
			if(k in o && o[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}