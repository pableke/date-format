
var df = require('../date-format');

var start = (new Date("2015-01-01")).getTime();
var end = (new Date("2015-12-31")).getTime();
function random(min, max) { return (Math.random() * max) + min; };
function randDate(min, max) { return min + Math.random() * (max - min); };
var dates = Array(100).fill(1).map(n => new Date(randDate(start, end)));

Object.keys(df.masks).forEach(function(mask, i, masks) {
	var date = dates[i];
	var dest = masks[Math.floor(random(0, masks.length))];
	var fmtDate = df.format(date, mask);
	console.log("date-format(" + fmtDate + ", " + mask + ", " + dest + ");")
	console.log("format -- test = " + fmtDate);
	var fmt = df.trDate(fmtDate, mask, dest);
	console.log("trDate -- test = " + fmt);
	console.log("toDate --- test = " + df.toDate(fmt, dest));
});
