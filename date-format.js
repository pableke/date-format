'use strict';

var self = this; //auto-reference
const tokens = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'/g;

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
	isoUtcDateTime:      "UTC:yyyy-mm-dd HH:MM:ssZ",
	dateTime:            "yyyy-mm-dd HH:MM:ss",
	expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z"
};

function _lpad(val) { return (val < 10) ? ("0" + val) : val; };
function _digit(coll, val) { return coll.indexOf(val) + 1; };

/**
 * trDae(date, mask, dest)
 *
 * @param date   date: date to format
 * @param string mask: format to apply
 * @param string dest: universal datetime indicator
 */
exports.trDate = function(date, mask, dest) {
	mask = masks[mask] || mask || masks.default;
	dest = masks[dest] || dest || masks.default;

	var parts = date.match(/\d{1,4}|[a-z]+/gi); //get date parts
	var flags = mask.match(tokens).reduce(function(r, t, i) {
		r[t] = parts[i];
		return r;
	}, {});

	//inicialize flags data object
	var i = date.lastIndexOf("-");
	var o = ((i > 10) && (i > (date.length - 8))) ? "-" : "+";
	flags.d = +flags.d || parseInt(flags.dd) || _digit(i18n.dayNamesShort, flags.ddd)
											|| _digit(i18n.dayNames, flags.dddd) || 1;
	flags.dd = flags.dd || _lpad(flags.d);
	flags.ddd = flags.ddd || i18n.dayNamesShort[flags.d - 1];
	flags.dddd = flags.dddd || i18n.dayNames[flags.d - 1];
	flags.m = +flags.m || parseInt(flags.mm) || _digit(i18n.monthNamesShort, flags.mmm)
											|| _digit(i18n.monthNames, flags.mmmm) || 1;
	flags.mm = flags.mm || _lpad(flags.m);
	flags.mmm = flags.mmm || i18n.monthNamesShort[flags.m - 1];
	flags.mmmm = flags.mmmm || i18n.monthNames[flags.m - 1];
	flags.yy = flags.yy || (flags.yyyy ? flags.yyyy.substr(2, 2) : Y.substr(2, 2));
	flags.yyyy = flags.yyyy || (Y.substr(0, 2) + flags.yy);
	flags.h = flags.h || "0";
	flags.hh = flags.hh || _lpad(flags.h);
	flags.H = flags.H || "0";
	flags.HH = flags.HH || _lpad(flags.H);
	flags.M = flags.M || "0";
	flags.MM = flags.MM || _lpad(flags.M);
	flags.s = flags.s || "0";
	flags.ss = flags.ss || _lpad(flags.s);
	flags.t = flags.t || ((+flags.H < 12) ? "a" : "p");
	flags.tt = flags.tt || flags.t + "m";
	flags.T = flags.T || flags.t.toUpperCase();
	flags.TT = flags.TT || flags.T + "M";
	flags.Z = flags.Z || "";
	flags.o = flags.o || "0000";
	flags.o = o + flags.o;
	//traslate date format from source mask to date output mask
	return dest.replace(tokens, function(match) { return flags[match]; });
};

/**
 * Transform the date string input into a valid date object, mask indicates the date format
 *
 * @param string date: date string format representation
 * @param string mask: define the date string format
 */
exports.toDate = function(date, mask) {
	mask = masks[mask] || mask || masks.default;
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
