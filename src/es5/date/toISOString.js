// toISOString
// Format a Date object as a string according to a subset of the ISO-8601 standard.
// Useful in Atom, among other things.
if (!Date.prototype.toISOString) {
	Date.prototype.toISOString = function() {
		return (
			this.getFullYear() + "-" +
			(this.getMonth() + 1) + "-" +
			this.getDate() + "T" +
			this.getHours() + ":" +
			this.getMinutes() + ":" +
			this.getSeconds() + "Z"
		); 
	};
}