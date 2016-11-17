
var df = require('../date-format');

function randomDate(start, end) {
	start = start || new Date(2000, 0, 1);
	end = end || new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var dest = ["isoDate", "dateFull", "latinDateTime", "dateTime", "shortTime"];
var dates = {
	"dd/mm/yyyy": "23/05/1826",
	"d/mmm/yyyy H:M": "1/Aug/2000 15:10",
	"dd-mm-yyyy HH:M:s": "3-8-1999 4:17:2",
	"mmmm dd yyyy H:M:s": "October 7 2008 09:36:12"
};

console.log("--------------");
console.log("trDate -- test");
console.log("--------------");

Object.keys(dates).forEach(function(mask, i) {
	console.log(mask + " = " + dates[mask]);
	console.log(dest[i] + " = " + df.trDate(dates[mask], mask, dest[i]));
});

console.log("\n\n");
console.log("---------------");
console.log("toDate --- test");
console.log("---------------");

Object.keys(dates).forEach(function(mask) {
	console.log(mask + " - " + dates[mask]);
	console.log(df.toDate(dates[mask], mask));
});
