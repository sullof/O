(function (thiz) {

    /*
     * O basic methods
     * version 1.7, 19 august 2010 - http://o.sullof.com
     * Copyright (c) 2008+ Francesco Sullo
     * Licensed as Open Source under MIT License
     */

	
	var O = thiz.O;
	O.__.thiz = thiz;
     
// base static methods:     
     
    O.expand({
    	
    	is: function (x,W) {
	    	if (O.isString(x)) {
	    		if (!W) W = O.__.thiz;
	    		return typeof W[x] != 'undefined';
	    	}
	    	else return false;
    	},

        isset: function (x,W) {
        	if (O.isString(x)) {
	    		if (!W) W = O.__.thiz;
        		var m = x.split("."), j;
        		for (j=0;j<m.length;j++) {
        			if (!O.is(m[j],W)) return false;
        			W = W[m[j]];
        		}
        		return true;
        	}
        	else return 0;
        },
        
        htmlTrim: function (x,y) {
            var o = x.toString();
            o = o ? O.trim(o).replace(/<[^>]+>/g,y?'':" ") : '';
            return o;
        },

        trim: function (x) {
            var o = x ? x.toString().replace(/^[\n\r\s\t]+/,"").replace(/[\n\r\s\t]+$/,"") : '';
            return o;
        },

        escape: function (o,x) {
        	// x manages exceptions
            return o ? (x ? o : encodeURIComponent(o.toString())) : '';
        },
        
        unescape: function (o) {
            return o ? unescape(o.toString()) : '';
        },
        
        int: function (o) {
        	var ret = o ? parseInt(o.toString(),10) : 0;
        	if (isNaN(ret)) ret = 0;
        	return ret;
        },

        typeOf: function (o) {
        	var t = typeof o;
        	if (t === 'object') {
                if (typeof o.length === 'number' && !(o.propertyIsEnumerable('length')) && typeof o.splice === 'function') {
                    return 'array';
                }
                else {
                    if (o.getFullYear) return 'date';
                    else if (o.constructor)
                        switch (o.constructor) {
                            case RegExp:
                                return 'regexp';
                            case O:
                            	return 'O';
                        }
                }
            }
            return t;
        },

        isO: function (o) {
            return O.typeOf(o) == 'O';
        },
        
        isString: function (o) {
            return O.typeOf(o) == 'string';
        },

        isObject: function (o,notArray) {
			if (notArray) return O.typeOf(o) == 'object';
            else return typeof o == 'object';
        },

        isNumber: function (o) {
            return O.typeOf(o) == 'number';
        },

        isArray: function (o) {
            return O.typeOf(o) == 'array';
        },

        isDate: function (o) {
            return O.typeOf(o) == 'date';
        },
        
        isFunction: function (o) {
            return O.typeOf(o) == 'function';
        },
        
        isISODateStr: function (o) {
			return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}){0,1}(:\d{3}){0,1}Z$/.test(0);
        },

        isRegExp: function (o) {
            return O.typeOf(o) == 'regexp';
        },

        isHexString: function (o) {
            return O.isString(o) && !/[^0123456789abcdef]/i.test(o) && o.length%2==0;
        },

        isBase64: function (o) {
            return O.isString(o)  && (/^[\w\d\/\+]+(=){0,2}$/i.test(o)
		// passpack modified base64 format (with ! instead of +)
		|| /^[\w\d\/\!]+(=){0,2}$/i.test(o));
        },

        toArray: function (o,x) {

        	var a = [], 
        		l = x ? x : o ? o.length : 0;

            if(O.isHexString(o)) {

                for (var j=0;j<l;j+=2)
                    a.push(parseInt(o.substring(j,j+2),16));
            }
            else {

            for (var j=0;j<l;j++)
                a.push(o.charCodeAt(j));
            }
            return a;
        },

		toCharArray: function (o) {
	
		    var a = [];
		    
		    for (var j=0;j<o.length;j++)
			a.push(o.substring(j,j+1));
	            
	            return a;
		},

        toStr: function (o,x) {
            // a seconda del tipo agisce
            var h = '';
            if (O.typeOf(o) == 'array') {
                var l = x ? x : o.length;
                for (var j=0;j<l;j++) h += String.fromCharCode(o[j]);
            }
            else if (O.isHexString(o)) {
                var l = x ? x : o.length;
                for (var j=0;j<l;j=j+2) h += String.fromCharCode(parseInt(o.substring(j,j+2),16));
            }
            else if (!O.isString(x)) {
                h = o.toString();
            }
            return h;
        },
        
        clone: function (o) {
        	if (thiz.JSON)
        		return thiz.JSON.parse(thiz.JSON.stringify(o));
        	else {
        		var r = {};
        		for (var j in o) r[j] = o[j];
        		return r;
        	}
        },
        
        objmerge: function (i,u) {
        	var o = O.clone(i);
    		for (var j in u) o[j] = O.clone(u[j]);
    		return o;
        },
        
        toHexstr: function (o) {
            var h = '', 
            	e;
        	if (O.isNumber(o)) {
    		    for (var i=7; i>=0; i--) { 
    		    	e = (o>>>(i*4)) & 0xf;
    		    	h += e.toString(16); 
    		    }
        	}
        	else if (O.isArray(o)) o = O.toStr(o);
            if (o) 
            	for (var j=0;j<o.length;j++) {
	                e = o.charCodeAt(j).toString(16);
	                h += (e.length == 1 ? '0' : '') + e;
	            }
            return h;
        },
        
        objectize: function (o) {
        	if (O.isObject(o)) return o;
        	return {};
        },

        arrayize: function (o) {
        	if (O.isArray(o)) return o;
        	return [];
        },
        
		isEmpty: function (o) {
	
	            if (O.isArray(o)){
	                    if (o.length) return 0;
	            }
	            else if (O.isObject(o,1)) {
	                    for (var j in o) return 0;
	            }
	            return 1;
	
		},

        fromUnixTstamp: function (o) {
            if (parseInt(o,10).toString() == o) {
                var d = new Date();
                d.setTime(o*1000);
                return d;
            }
            return false;
        },
        
        sizeOf: function (o) {
        	if (!o) return 0;
        	if (O.isArray(o)) return o.length;
        	else if (O.isObject(o)) {
        		try {
        			var n = 0;
        			for (var j in o) {
        				n++;
        			}
        			return n;
        		}
        		catch(e) {
        			return 0;
        		}
        	}
        	return 1;
        },
        
        compare: function(u, v) {

        	// based on PostRequest by Bernd Jendrissek        	
        	// http://stackoverflow.com/questions/201183/how-do-you-determine-equality-for-two-javascript-objects/2049359#2049359
        	
        	var i;
        	
            if (O.typeOf(u) != O.typeOf(v))
                return false;
            
            if (O.isString(u) || O.isNumber(u))
            	return u==v ? true : false;
            
            if (O.isDate(u))
            	return u.getTime()==v.getTime() ? true : false; 

            var arr = O.isArray(u),
            	allkeys = {};
            if (arr) {
            	if (u.length != v.length) 
            		return false;
            	for (i=0;i<u.length;i++)
            		allkeys[""+i] = 1;
            }
            else {
	            for (i in u)
	                allkeys[i] = 1;
	            
	            for (i in v)
	                allkeys[i] = 1;
        	}
        
            for (i in allkeys) {
                if (!arr && u.hasOwnProperty(i) != v.hasOwnProperty(i)) {
                    if ((u.hasOwnProperty(i) && O.typeOf(u[i]) == 'function') ||
                        (v.hasOwnProperty(i) && O.typeOf(v[i]) == 'function')) {
                        continue;
                    } else {
                        return false;
                    }
                }
                if (O.typeOf(u[i]) != O.typeOf(v[i])) {
                    return false;
                }
                if (O.isObject(u[i])) {
                    if (!O.compare(u[i], v[i])) {
                        return false;
                    }
                } else {
                    if (u[i] !== v[i]) {
                        return false;
                    }
                }
            }
            return true;
        },
        
        low: function (o) {
        	var ret = '';
        	try {
        		if (!O.isString(o)) o = o.toString();
            	ret = o.toLowerCase();
        	} catch(e) {}
        	return ret;
        },

        up: function (o) {
        	var ret = '';
        	try {
        		if (!O.isString(o)) o = o.toString();
            	ret = o.toUpperCase();
        	} catch(e) {}
        	return ret;
        },
        
        lowEq: function (o,u) {
        	return O.low(o) == O.low(u);
        },
        
        toTimestamp: function (d) {
        	if (!(d && O.isDate(d))) d = new Date();
            return parseInt(d.getTime()/1000,10);
        },

        fromTimestamp: function (t) {
        	if (O.isString(t)) t = parseInt(t,10);
        	return O.isNumber(t) ? new Date(1000*t) : null;
        },
        
        getSensitive: function (o,k,i) {
        	if (O.isObject(o)) {
	        	if (o[k]) return i ? k : o[k];
	        	for (var j in o)
	        		if (O.low(j) == O.low(k))
	        			return i ? j : o[j];
        	}
        	return '';
        },
        
        getSensitiveKey: function (o,k) {
        	return O.getSensitive(o,k,1);
        },
        
        keys: function (o) {
        	var ret = {};
        	if (O.isObject(o))
        		for (var j in o)
        			ret[j] = 1;
        	return ret;
        },
        
        keysArray: function (o) {
        	var ret = [];
        	if (O.isObject(o))
        		for (var j in o)
        			ret.push(j);
        	return ret;
        },
        
        isIn: function(a,o,i) {
        	if (O.isArray(a))
        		for (var j=0;j<a.length;j++) 
        			if (a[j] == o || (i && O.lowEq(a[j],o)))
        				return true;
        	return false;
        },
        
        valuesToKeys: function (o) {
        	var ret = {};
        	if (O.isArray(o)) 
        		for (var j=0;j<o.length;j++)
        			if (o[j]) 
        				ret[o[j]] = 1;
        	return ret;
        },
        
        reverse: function (o) {
        	if (O.isString(o)) {
        		var s = '';
	        	for (var j = o.length; j >= 0; j--)
	        		s += o.substring(j-1,j);
        		return s;
        	}
        	else if (O.isArray(o)) {
        		var s = [];
	        	for (var j = x.length-1; j >= 0; j--)
	        		s.push(x[j]);
        		return s;
        	}
        },
        
        cutFrom: function (A,v,i) {
        	if (O.isArray(A) && v)
	    		for (var k=0;k<A.length;k++)
	    			if (A[k] == v || (i && O.lowEq(A[k],v))) {
	    				A.splice(k,1);
	    				break;
	    			}
        	return A;
    	}

    	
        

    });

    
// basic methods:

    O.extend({

        typeOf: function (x) {
            if (this.type) return this.type;
            else return O.typeOf(this.O);
        },

        toArray: function (x) {

            this.O = O.toArray(this.O,x);
            this.type = 'array';
            return this;
        },

        toCharArray: function () {

            this.O = O.toCharArray(this.O);
            this.type = 'array';
            return this;
        },


        toStr: function (x) {

            this.O = O.toStr(this.O,x);
            this.type = 'string';
            return this;
        },

        toHexstr: function () {

            this.O = O.toHexstr(this.O);
            return this;
        },

        escape: function (x) {
            this.O = O.escape(this.O,x);
            return this;
        },

        unescape: function () {
            this.O = O.unescape(this.O);
            return this;
        },

        htmlTrim: function () {
            this.O = O.htmlTrim(this.O);
            return this;
        },

        trim: function () {
            this.O = O.trim(this.O);
            return this;
        },

        toLower: function () {
            if (O.isString(this.O)) {
                var o = this.O.toString();
                this.O = o.toLowerCase();
            }
            this.type = 'string';
            return this;
        },

        toUpper: function (x) {
            if (O.isString(this.O)) {
                var o = this.O.toString();
                this.O = o.toUpperCase();
            }
            this.type = 'string';
            return this;
        },

        low: function () {
            this.O = O.low(this.O);
            this.type = 'string';
            return this;
        },

        up: function (x) {
            this.O = O.up(this.O);
            this.type = 'string';
            return this;
        },
        
        int: function (x) {
            this.O = O.int(this.O);
            this.type = 'number';
            return this;
        },
        
        toTimestamp: function (x) {
            this.O = O.toTimestamp(this.O);
            this.type = 'number';
            return this;
        },
        
        fromTimestamp: function (x) {
            this.O = O.fromTimestamp(this.O);
            this.type = 'date';
            return this;
        },
        

        noAction: function () {
            return this;
        }

    });

})(this);