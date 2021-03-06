# date-format

Node JS and JavaScript client side date format conversor.

## Usage

Some simple Node JS examples listed:
```js
	var df = require("date-format");
	var now = new Date();

	// Basic usage
	df.format(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	// Saturday, June 9th, 2007, 5:46:21 PM

    // You can use one of several named masks
    df.format(now, "isoDateTime");
    // 2007-06-09T17:46:21

    // ...Or add your own
    df.masks.hammerTime = 'HH:MM! "Can\'t touch this!"';
    df.format(now, "hammerTime");
    // 17:46! Can't touch this!

    // Reverse action: you can pass a string parameter in some format, and transform it in a valid date object
    df.toDate("October 7 2008 09:36:12", "mmmm dd yyyy H:M:s");
    // Tue Oct 07 2008 09:36:12 GMT+0200 (Hora de verano romance)
```
## License

(c) 2015-2016 Pablo Rosique, GitHub Inc.
