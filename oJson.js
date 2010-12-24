
(function (thiz) {
	
	var O = thiz.O;
	
	O.__.localTimezone = new Date().getTimezoneOffset()*60;
	
	O.__.serverTimezone = thiz.SERVER_TIMEZONE ? thiz.SERVER_TIMEZONE : 0; // if UTC
	
	O.__.JSON = function () {
	
	// did private to avoid interactions with native JSON objects
	
	/*
	    json2.js
	    2008-01-17
	
	    Public Domain
	
	    No warranty expressed or implied. Use at your own risk.
	
	    See http://www.JSON.org/js.html
	
	    This file creates a global JSON object containing two methods:
	
	        JSON.stringify(value, whitelist)
	            value       any JavaScript value, usually an object or array.
	
	            whitelist   an optional array prameter that determines how object
	                        values are stringified.
	
	            This method produces a JSON text from a JavaScript value.
	            There are three possible ways to stringify an object, depending
	            on the optional whitelist parameter.
	
	            If an object has a _toJSON method, then the _toJSON() method will be
	            called. The value returned from the _toJSON method will be
	            stringified.
	
	            Otherwise, if the optional whitelist parameter is an array, then
	            the elements of the array will be used to select members of the
	            object for stringification.
	
	            Otherwise, if there is no whitelist parameter, then all of the
	            members of the object will be stringified.
	
	            Values that do not have JSON representaions, such as undefined or
	            functions, will not be serialized. Such values in objects will be
	            dropped; in arrays will be replaced with null.
	            JSON.stringify(undefined) returns undefined. Dates will be
	            stringified as quoted ISO dates.
	
	            Example:
	
	            var text = JSON.stringify(['e', {pluribus: 'unum'}]);
	            // text is '["e",{"pluribus":"unum"}]'
	
	        JSON.parse(text, filter)
	            This method parses a JSON text to produce an object or
	            array. It can throw a SyntaxError exception.
	
	            The optional filter parameter is a function that can filter and
	            transform the results. It receives each of the keys and values, and
	            its return value is used instead of the original value. If it
	            returns what it received, then structure is not modified. If it
	            returns undefined then the member is deleted.
	
	            Example:
	
	            // Parse the text. If a key contains the string 'date' then
	            // convert the value to a date.
	
	            myData = JSON.parse(text, function (key, value) {
	                return key.indexOf('date') >= 0 ? new Date(value) : value;
	            });
	
	    This is a reference implementation. You are free to copy, modify, or
	    redistribute.
	
	    Use your own copy. It is extremely unwise to load third party
	    code into your pages.
	*/
	
	/*jslint evil: true */
	
	/*global JSON */
	
	/*members "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	    charCodeAt, floor, getUTCDate, getUTCFullYear, getUTCHours,
	    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join, length,
	    parse, propertyIsEnumerable, prototype, push, replace, stringify, test,
	    _toJSON, toJSON, toString
	*/
	
	
	
	    function f(n) {    // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    Date.prototype._toJSON = function () {
	
	// Eventually, this method will be based on the date.toISOString method.
	
//	        return this.getUTCFullYear()   + '-' +
//	             f(this.getUTCMonth() + 1) + '-' +
//	             f(this.getUTCDate())      + 'T' +
//	             f(this.getUTCHours())     + ':' +
//	             f(this.getUTCMinutes())   + ':' +
//	             f(this.getUTCSeconds())   + 'Z';
	    	
	        return this.getFullYear()   + '-' +
	            f(this.getMonth() + 1) + '-' +
	            f(this.getDate())      + 'T' +
	            f(this.getHours())     + ':' +
	            f(this.getMinutes())   + ':' +
	            f(this.getSeconds())   + 'Z';
	        
	    };
	
	
		function isISODate (v) {
			return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}){0,1}Z$/.test(v);
		}
	
	
		function ISOToDate (v) {
			var ret = new Date();
			ret.setFullYear(v.substring(0,4));
			ret.setMonth(parseInt(v.substring(5,7),10)-1);
			ret.setDate(v.substring(8,10));
			ret.setHours(v.substring(11,13));
			ret.setMinutes(v.substring(14,16));
			ret.setSeconds(v.substring(17,19));
			return ret;
		}
	
	
	    var m = {    // table of character substitutions
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"' : '\\"',
	        '\\': '\\\\'
	    };
	
	    function stringify(value, whitelist) {
	        var a,          // The array holding the partial texts.
	            i,          // The loop counter.
	            k,          // The member key.
	            l,          // Length.
	            r = /["\\\x00-\x1f\x7f-\x9f]/g,
	            v;          // The member value.
	
	        switch (typeof value) {
	        case 'string':
	
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe sequences.
	
	            return r.test(value) ?
	                '"' + value.replace(r, function (a) {
	                    var c = m[a];
	                    if (c) {
	                        return c;
	                    }
	                    c = a.charCodeAt();
	                    return '\\u00' + Math.floor(c / 16).toString(16) +
	                                               (c % 16).toString(16);
	                }) + '"' :
	                '"' + value + '"';
	
	        case 'number':
	
	// JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	            return String(value);
	
	        case 'object':
	
	// Due to a specification blunder in ECMAScript,
	// typeof null is 'object', so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	// If the object has a _toJSON method, call it, and stringify the result.
	
	            if (typeof value._toJSON === 'function') {
	                return stringify(value._toJSON());
	            }
	            a = [];
	            if (typeof value.length === 'number' &&
	                    !(value.propertyIsEnumerable('length'))) {
	
	// The object is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.
	
	                l = value.length;
	                for (i = 0; i < l; i += 1) {
	                    a.push(stringify(value[i], whitelist) || 'null');
	                }
	
	// Join all of the elements together and wrap them in brackets.
	
	                return '[' + a.join(',') + ']';
	            }
	            if (whitelist) {
	
	// If a whitelist (array of keys) is provided, use it to select the components
	// of the object.
	
	                l = whitelist.length;
	                for (i = 0; i < l; i += 1) {
	                    k = whitelist[i];
	                    if (typeof k === 'string') {
	                        v = stringify(value[k], whitelist);
	                        if (v) {
	                            a.push(stringify(k) + ':' + v);
	                        }
	                    }
	                }
	            } else {
	
	// Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (typeof k === 'string') {
	                        v = stringify(value[k], whitelist);
	                        if (v) {
	                            a.push(stringify(k) + ':' + v);
	                        }
	                    }
	                }
	            }
	
	// Join all of the member texts together and wrap them in braces.
	
	            return '{' + a.join(',') + '}';
	        }
	    }
	
	// base filter function
	// it converts ISO date strings to Date objects:
	
	    function baseFilter (k,v) {
			if (typeof(v) != 'string' || !O.__.JSON.isISODate(v)) return v;
			return O.__.JSON.ISOToDate(v);
		}
	
	
	    return {
	
	// O additional methods:
	        isISODate: isISODate,
	        ISOToDate: ISOToDate,
	        baseFilter: baseFilter,
	
	// standard methods:
	        stringify: stringify,
	        parse: function (text, filter) {
	            var j;
	
	            function walk(k, v) {
	                var i, n;
	                if (v && typeof v === 'object') {
	                    for (i in v) {
	                        if (Object.prototype.hasOwnProperty.apply(v, [i])) {
	                            n = walk(i, v[i]);
	                            if (n !== undefined) {
	                                v[i] = n;
	                            }
	                        }
	                    }
	                }
	                return filter(k, v);
	            }
	
	
	// Parsing happens in three stages. In the first stage, we run the text against
	// regular expressions that look for non-JSON patterns. We are especially
	// concerned with '()' and 'new' because they can cause invocation, and '='
	// because it can cause mutation. But just to be safe, we want to reject all
	// unexpected forms.
	
	// We split the first stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace all backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	            if (/^[\],:{}\s]*$/.test(
	                text
	                .replace(/\\./g, '@')
	                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
	            )) {
	
	// In the second stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.
	
	                j = eval('(' + text + ')');
	
	// In the optional third stage, we recursively walk the new structure, passing
	// each name/value pair to a filter function for possible transformation.
	
	
					if (!filter) filter = O.__.JSON.baseFilter;
	
	                return typeof filter === 'function' ? walk('', j) : j;
	            }
	
	// If the text is not JSON parseable, then a SyntaxError is thrown.
	
	            throw new SyntaxError('parseJSON');
	        }
	    };
	}();

	O.__.toXDate = function (t,f,s) {
		t = O.toTimestamp(t);
		if (O.isNumber(t)) {
			t += (s ? +1 : -1) * O.timeOffset();
			return f ? new Date(1000 * t) : t;
		}
		else 
			return false;
	};
	

	O.expand({
		
			
			toTimestamp: function (d) {
				if (!d) d = new Date();
				else if (O.isNumber(d)) return d;
				else if (O.isString(d)) {
					if (/^[0-9]+$/.test(d)) return parseInt(d,10);
					else d = O.ISOToDate(d);
				}
				if (O.isDate(d))
					return parseInt(d.getTime()/1000,10);
				else 
					return false;
			},
			
			fromTimestamp: function (t) {
				t = O.toTimestamp(t);
				if (O.isNumber(t))
					return new Date(1000 * t);
				else 
					return false;
			},
			
			toLocalTimestamp: function (t) {
				return O.__.toXDate(t);
			},

			toServerTimestamp: function (t) {
				return O.__.toXDate(t,'',1);
			},
			
			toLocalDate: function (t) {
				return O.__.toXDate(t,1);
			},

			toServerDate: function (t) {
				return O.__.toXDate(t,1,1);
			},
			
			timeOffset: function () {
				return O.__.localTimezone + O.__.serverTimezone;
			},
			
			fixISODate: function (o) {
                if (O.isDate(o)) return o;
                else return o.replace(/ /,"T")+"Z";
			},

            isISODate: O.__.JSON.isISODate,
            
            ISOToDate: function (o) {
                if (O.isDate(o)) return o;
                else return O.__.JSON.ISOToDate(o);
            },

            toJSON: function (obj) {

                var ret;
                try {
                    ret = O.__.JSON.stringify(obj);
                }
                catch(e) {}
                return ret;
            },

            toObject: function (str) {
                
                var ret;
                try {
                    ret = O.__.JSON.parse(str);
                }
                catch(e) {}
                return ret;
            },
            
            clone: function (o) {
            	return O(o).toJSON().toObject().end();
            }                        
	});

	// for back compatibility:
	O.copy = O.clone;



    O.extend({
    	
    		toTimestamp: function () {
				this.O = O.toTimestamp(this.O);
				return this;
			},
			
			fromTimestamp: function () {
				this.O = O.fromTimestamp(this.O);
				return this;
			},
			
			toLocalTimestamp: function () {
				this.O = O.toLocalTimestamp(this.O);
				return this;
			},
		
			toServerTimestamp: function () {
				this.O = O.toServerTimestamp(this.O);
				return this;
			},
			
			toLocalDate: function () {
				this.O = O.toLocalDate(this.O);
				return this;
			},
		
			toServerDate: function () {
				this.O = O.toServerDate(this.O);
				return this;
			},
			
    		fixISODate: function () {
				this.O = O.fixISODate(this.O);
				return this;
			},
			
            toJSON: function (forceServerDate) {

                try {
                    var mom = O.__.JSON.stringify(this.O);
                    this.O = mom;
                }
                catch(e) {
                    this.O = {};
                    this.log('toJSON: '+e.message);
                }
                return this;
            },

            toObject: function () {

                try {
                    var mom = O.__.JSON.parse(this.O.toString());
                    this.O = mom;
                }
                catch(e) {
                    this.log('toObject: '+e.message);
                }
                return this;
            }
    });

})(this);