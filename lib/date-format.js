'use strict';

var _self = this; //auto-reference module
var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
var timezoneClip = /[^-+\dA-Z]/g;

exports.masks = {
	'default':               'ddd mmm dd yyyy HH:MM:ss',
	'shortDate':             'm/d/yy',
	'mediumDate':            'mmm d, yyyy',
	'longDate':              'mmmm d, yyyy',
	'fullDate':              'dddd, mmmm d, yyyy',
	'shortTime':             'h:MM TT',
	'mediumTime':            'h:MM:ss TT',
	'longTime':              'h:MM:ss TT Z',
	'isoDate':               'yyyy-mm-dd',
	'isoTime':               'HH:MM:ss',
	'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
	'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
	'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
};

// Internationalization strings
exports.i18n = {
	dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

/**
 * Determine if the date param is a valid date object
 *
 * @param {Object} `date`
 */
exports.isValid = function(date) {
	return (date instanceof Date) && date.getTime && !isNaN(date.getTime());
};

/**
 * Transform the date string input into a valid date object, mask indicates the date format
 *
 * @param string date: date string format representation
 * @param string mask: define the date string format
 */
exports.toDate = function(date, mask) {
	if (!date) return null;
	var flags = {}; //parts container
	mask = _self.masks[mask] || mask || _self.masks['default'];
	var values = date.trim().match(/[a-zA-Z]+|\d+/g);
	mask.match(token).forEach((v, i) => flags[v] = values[i]);

	//sanitize input params for the Date constructor
	var d = flags.d || flags.dd || 1; //dia base 1
	var m = flags.m || flags.mm;
	if (m) m--; //mes base 0
	else {
		m = _self.i18n.monthNamesShort.indexOf(flags.mmm);
		if (m < 0)
			m = Math.max(_self.i18n.monthNames.indexOf(flags.mmmm), 0);
	}
	var y = flags.yyyy || (new Date()).getFullYear().toString().substr(0, 2) + flags.yy;
	var H = flags.H || flags.HH || ((flags.h || flags.hh) % 12) || 12;
	var M = flags.M || flags.MM || 0;
	var s = flags.s || flags.ss || 0;
	var oDate = new Date(+y, m, d, +H, +M, +s);
	return _self.isValid(oDate) ? oDate : null;
};

function lpad(val, len) {
	val = String(val);
	len = len || 2;
	while (val.length < len) {
		val = '0' + val;
	}
	return val;
};

/**
 * format(value, mask)
 *
 * @param date   date: date to format
 * @param string mask: format to apply
 * @param string utc:  universal datetime indicator
 * @param string gtm:  internet greenwich mean indicator
 */
exports.format = function(date, mask, utc, gmt) {
	// You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
	if (arguments.length === 1 && (typeof date == 'string') && !/\d/.test(date)) {
		mask = date;
		date = null;
	}

	date = date || new Date();
	if (!_self.isValid(date)) {
		return null; //invalid date
	}

	mask = _self.masks[mask] || mask || _self.masks['default'];

	// Allow setting the utc/gmt argument via the mask
	var maskSlice = mask.slice(0, 4);
	if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
		gmt = (maskSlice === 'GMT:');
		mask = mask.slice(4);
		utc = true;
	}

	var _ = utc ? 'getUTC' : 'get';
	var d = date[_ + 'Date']();
	var D = date[_ + 'Day']();
	var m = date[_ + 'Month']();
	var y = date[_ + 'FullYear']();
	var H = date[_ + 'Hours']();
	var M = date[_ + 'Minutes']();
	var s = date[_ + 'Seconds']();
	var L = date[_ + 'Milliseconds']();
	var o = utc ? 0 : date.getTimezoneOffset();
	var W = getWeek(date);
	var N = getDayOfWeek(date);
	var flags = {
		d:    d,
		dd:   lpad(d),
		ddd:  _self.i18n.dayNamesShort[D],
		dddd: _self.i18n.dayNames[D],
		m:    m + 1,
		mm:   lpad(m + 1),
		mmm:  _self.i18n.monthNamesShort[m],
		mmmm: _self.i18n.monthNames[m],
		yy:   String(y).slice(2),
		yyyy: y,
		h:    H % 12 || 12,
		hh:   lpad(H % 12 || 12),
		H:    H,
		HH:   lpad(H),
		M:    M,
		MM:   lpad(M),
		s:    s,
		ss:   lpad(s),
		l:    lpad(L, 3),
		L:    lpad(Math.round(L / 10)),
		t:    H < 12 ? 'a'  : 'p',
		tt:   H < 12 ? 'am' : 'pm',
		T:    H < 12 ? 'A'  : 'P',
		TT:   H < 12 ? 'AM' : 'PM',
		Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
		o:    (o > 0 ? '-' : '+') + lpad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
		S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
		W:    W,
		N:    N
	};

	return mask.replace(token, function(match) {
		return (match in flags) ? flags[match]
								: match.slice(1, match.length - 1);
	});
};

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getWeek(date) {
	// Remove time components of date
	var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	// Change date to Thursday same week
	targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

	// Take January 4th as it is always in week 1 (see ISO 8601)
	var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

	// Change date to Thursday same week
	firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

	// Check if daylight-saving-time-switch occured and correct for it
	var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
	targetThursday.setHours(targetThursday.getHours() - ds);

	// Number of weeks between target Thursday and first Thursday
	var weekDiff = (targetThursday - firstThursday) / (86400000*7);
	return 1 + Math.floor(weekDiff);
};

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getDayOfWeek(date) {
	var dow = date.getDay();
	return (dow === 0) ? 7 : dow;
};
