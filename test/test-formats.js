
var df = require('../date-format');

function randomDate(start, end) {
	start = start || new Date(2000, 0, 1);
	end = end || new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

console.log("---------------");
console.log("formats -- test");
console.log("---------------");

Object.keys(df.masks).forEach(function(mask) {
	console.log(mask + " = " + df.format(randomDate(), df.masks[mask]));
});

console.log("\n\n");
console.log("---------------");
console.log("toDate --- test");
console.log("---------------");

var _dates = {
	"dd/mm/yyyy": "23/05/1826",
	"d/mmm/yyyy H:M": "1/Aug/1826 15:10",
	"dd-mm-yyyy HH:M:s": "3-8-1999 4:17:2",
	"mmmm dd yyyy H:M:s": "October 7 2008 09:36:12"
};

Object.keys(_dates).forEach(function(mask) {
	console.log(mask + " - " + _dates[mask]);
	console.log(df.toDate(_dates[mask], mask));
});
