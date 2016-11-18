
function DateFormat(i18n) {
	var self = this; //auto-reference
	const reMaskTokens = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'/g;
	const reDateTokens = /\d{1,4}|[a-z]+/gi; //split date string parts
	const masks = { //masks container
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
	this.masks = masks;

	i18n = i18n || {};
	i18n.dayNamesShort = i18n.dayNamesShort || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	i18n.dayNames = i18n.dayNames || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	i18n.monthNamesShort = i18n.monthNamesShort || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	i18n.monthNames = i18n.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	function ldap(val) { return (val < 10) ? ("0" + val) : val; };
	function digit(coll, val) { return coll.indexOf(val) + 1; }; //-1 = false, int = 0
	function dayOfWeek(date) { return date.getDay(); }; //get number day in week
	var Y = (new Date()).getFullYear().toString(); //this year string

	this.trDate = function(date, mask, dest) {
		mask = masks[mask] || mask || masks.default;
		dest = masks[dest] || dest || masks.default;

		var parts = date.match(reDateTokens); //get date parts
		var flags = mask.match(reMaskTokens).reduce(function(r, t, i) {
			r[t] = parts[i];
			return r;
		}, {});

		//inicialize flags data object
		flags.yy = flags.yy || (flags.yyyy ? flags.yyyy.substr(2, 2) : Y.substr(2, 2));
		flags.yyyy = flags.yyyy || (Y.substr(0, 2) + flags.yy);
		flags.m = +flags.m || parseInt(flags.mm) || digit(i18n.monthNamesShort, flags.mmm)
												|| digit(i18n.monthNames, flags.mmmm) || 1;
		flags.mm = flags.mm || ldap(flags.m);
		flags.mmm = flags.mmm || i18n.monthNamesShort[flags.m - 1];
		flags.mmmm = flags.mmmm || i18n.monthNames[flags.m - 1];
		flags.d = +flags.d || parseInt(flags.dd) || digit(i18n.dayNamesShort, flags.ddd)
												|| digit(i18n.dayNames, flags.dddd) || 1;
		flags.dd = flags.dd || ldap(flags.d);
		var ddd = dayOfWeek(new Date(flags.yyyy, flags.m, flags.d));
		flags.ddd = flags.ddd || i18n.dayNamesShort[ddd];
		flags.dddd = flags.dddd || i18n.dayNames[ddd];
		flags.h = flags.h || "0";
		flags.hh = flags.hh || ldap(flags.h);
		flags.H = flags.H || "0";
		flags.HH = flags.HH || ldap(flags.H);
		flags.M = flags.M || "0";
		flags.MM = flags.MM || ldap(flags.M);
		flags.s = flags.s || "0";
		flags.ss = flags.ss || ldap(flags.s);
		flags.t = flags.t || ((+flags.H < 12) ? "a" : "p");
		flags.tt = flags.tt || flags.t + "m";
		flags.T = flags.T || flags.t.toUpperCase();
		flags.TT = flags.TT || flags.T + "M";
		flags.Z = flags.Z || "";
		var o = (date.indexOf("+0") > 6) ? "+" : "-";
		flags.o = flags.o ? (o + flags.o) : "+0000";
		//traslate date format from source mask to date output mask
		return dest.replace(reMaskTokens, function(match) { return flags[match]; });
	};

	this.toDate = function(date, mask) {
		mask = masks[mask] || mask || masks.default;
		return new Date(self.trDate(date, mask, "isoDateTime"));
	};

	this.isDate = function(date) {
		return (date instanceof Date) && date.getTime && !isNaN(date.getTime());
	};

	this.format = function(date, mask) {
		mask = masks[mask] || mask || masks.default;
		return self.trDate(date.toString(), "default", mask);
	};
};
