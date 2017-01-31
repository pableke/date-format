'use strict';

var self = this; //auto-reference
const reMaskTokens = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'/g;
const reDateTokens = /[\+\-]\d{4}|\d{1,4}|[a-z]+/gi; //default split date string parts

var i18n = exports.i18n = {}; //Internationalization object
i18n.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
i18n.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
i18n.monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
i18n.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var masks = exports.masks = { //masks container
	default:             "ddd mmm dd yyyy HH:MM:ss",
	shortDate:           "yy/m/d",
	mediumDate:          "mmm d, yyyy",
	longDate:            "mmmm d, yyyy",
	fullDate:            "dddd, mmmm d, yyyy",
	shortTime:           "h:MM TT",
	mediumTime:          "h:MM:ss TT",
	longTime:            "h:MM:ss TT Z",
	isoDate:             "yyyy-mm-dd",
	latinDate:           "dd/mm/yyyy",
	isoTime:             "HH:MM:ss",
	isoDateTime:         "yyyy-mm-dd HH:MM:ss",
	latinDateTime:       "dd/mm/yyyy HH:MM:ss",
	isoUtcDateTime:      "yyyy-mm-dd HH:MM:ss Z",
	dateTime:            "yyyy-mm-dd HH:MM:ss",
	expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z"
};

function lpad(val) { return (val < 10) ? ("0" + val) : val; }; //alwais 2 digits
function digit(coll, val) { return coll.indexOf(val) + 1; }; //-1 = false, int = 0

var now = new Date();
var Y = now.getFullYear().toString(); //this year string
var tzo = now.getTimezoneOffset(); //local time zone offset
var o = (Math.floor(Math.abs(tzo) / 60) * 100 + Math.abs(tzo) % 60).toString();
var O = ((tzo < 0) ? "-" : "+") + "0000".substring(o.length) + o;

/**
 * trDae(date, mask, dest)
 *
 * @param date   date: date to format
 * @param string mask: format to apply
 * @param string dest: universal datetime indicator
 */
exports.trDate = function(date, mask, dest) {
	if (!date || (typeof date !== "string"))
		return date; //not a valid input date format
	mask = masks[mask] || mask || masks.default;
	dest = masks[dest] || dest || masks.default;

	var flags = {}; //flags container
	var parts = date.match(reDateTokens); //get date parts
	mask.match(reMaskTokens).forEach(function(t, i) {
		flags[t] = parts[i];
	});

	//inicialize flags data object
	flags.yy = flags.yy || (flags.yyyy ? flags.yyyy.substr(2, 2) : Y.substr(2, 2));
	flags.yyyy = flags.yyyy || (Y.substr(0, 2) + flags.yy);
	flags.m = +flags.m || parseInt(flags.mm) || digit(i18n.monthNamesShort, flags.mmm)
											|| digit(i18n.monthNames, flags.mmmm) || 1;
	flags.mm = flags.mm || lpad(flags.m);
	flags.mmm = flags.mmm || i18n.monthNamesShort[flags.m - 1];
	flags.mmmm = flags.mmmm || i18n.monthNames[flags.m - 1];
	flags.d = +flags.d || parseInt(flags.dd) || digit(i18n.dayNamesShort, flags.ddd)
											|| digit(i18n.dayNames, flags.dddd) || 1;
	flags.dd = flags.dd || lpad(flags.d);
	var D = (new Date(flags.yyyy, flags.m, flags.d)).getDay();
	flags.ddd = flags.ddd || i18n.dayNamesShort[D];
	flags.dddd = flags.dddd || i18n.dayNames[D];
	flags.h = flags.h || flags.hh;
	flags.H = flags.H || flags.HH || flags.h || 0;
	flags.HH = flags.HH || lpad(flags.H);
	flags.h = flags.h || (flags.H % 12) || 12;
	flags.hh = flags.hh || lpad(flags.h);
	flags.M = flags.M || 0;
	flags.MM = flags.MM || lpad(flags.M);
	flags.s = flags.s || "0";
	flags.ss = flags.ss || lpad(flags.s);
	flags.t = flags.t || ((+flags.H < 12) ? "a" : "p");
	flags.tt = flags.tt || flags.t + "m";
	flags.T = flags.T || flags.t.toUpperCase();
	flags.TT = flags.TT || flags.T + "M";
	flags.Z = flags.Z || "";
	flags.o = flags.o || O;
	return dest.replace(reMaskTokens, function(match) { return flags[match]; });
};

/**
 * Transform the date string input into a valid date object, mask indicates the date format
 *
 * @param string date: date string format representation
 * @param string mask: define the date string format
 */
exports.toDate = function(date, mask) {
	return new Date(self.trDate(date, mask, "isoDateTime"));
};

/**
 * Determine if the date param is a valid date object
 *
 * @param {Object} `date`
 */
exports.isDate = function(date) {
	return (date instanceof Date) && date.getTime && !isNaN(date.getTime());
};

exports.format = function(date, mask) {
	return self.trDate(date.toString(), "default", mask);
};
