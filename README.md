O, a chained thought
====================

The goal of O is to simplify the concatenation of operations.

## Brief history

During development of Passpack I was searching for libraries that should help me to 
develope a safe application. I found several useful Javascript libraries, but their 
"presentation" was not so good for my scopes. So I transformed them in something more 
handy. After some time, on July 2008, Passpack released an open source library that 
joined the libraries in order to create a coherent tool. But it wasn't what I was 
thinking, so I continue to work on the model and finally I wrote O.

Passpack uses O from a while and I am very satisfied of the maneuverability of the tool. 
Now I want to publish it for other developers that want to improve it or simply use it.

## Why use O

Consider that you have to encrypt an object with AES and send it escaped to the server. 
Probably you have something as

	var ret = 
	    encodeURIComponent(
	        Base64encode(
	            AESEncrypt256(
	                JSON.stringify(myObject),
	                myKey
	            )
	        )
	    );
	    
This is not so easy to read. With O you can obtain the same result with

	var ret = 
	    O(myObject)
	    .toJSON()
	    .toAES(myKey)
	    .toBase64()
	    .escape()
	    .end();

As you can see, it is more concise and the flux of the concatenation of the 
operation is definitely clear.

## The core definition

	(function (thiz) {
	 
	    /*
	     * O - a chained thought
	     * version 1.2, 31 november 2009 - http://o.sullof.com
	     * Copyright (c) 2008+ Francesco Sullo
	     * Licensed as Open Source under MIT License
	     */
	 
	    var O = thiz.O = 
	        function (o) {
	            return new O._._(o);
	        };
	     
	    O.info = {
	            version: "1.2",
	            release: "2009-11-31"
	    };
	 
	    O._ = O.prototype = {
	 
	        _: function (o) {
	            this.O = o;
	            this.L = [o ? '' : 'Oops'];
	            this.constructor = O;
	            return this;
	        },
	 
	        log: function (l) {
	            if (l) this.L.push(l);
	        },
	 
	        end: function (obj) {
	            var o = this.O;
	            delete this.O;
	            if (typeof obj == 'object') obj.log = this.L;
	            delete this.L;
	            return o;
	        }
	    };
	 
	 
	    O._._.prototype = O._;
	 
	    // container for private ojects:
	     
	    O.__ = {};
	 
	     
	    // this extends static methods:
	 
	    O.expand = function () {
	        for (var j in arguments[0])
	            O[j] = arguments[0][j];
	    };
	 
	    // This extends objects' methods:
	 
	     O.extend = function () {
	         for (var j in arguments[0])
	             O._[j] = arguments[0][j];
	     };
	 
	})(this);
	
The method expand adds static method that we will use as something 
like O.staticMethod(myvar)

The method extend adds method to the objects of type O. That methods 
will be used as something like O(myvar).staticMethod().end()

## A plugin example.

The following code implements a routine to convert base-10 integers to 
base-62 integers (as url-shorteners do).


	(function (thiz) {
	     
	    var O = thiz.O;
	     
	    O.__.base62keystr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	     
	    O.expand({
	     
	        toBase62: function (x) {
	            if (!x) return "0";
	            var ret = "";
	            while (x > 0) {
	                var p = x % 62;
	                ret = O.__.base62keystr.substring(p,p+1) + ret;
	                x = Math.floor(x/62);
	            }
	            return ret;
	        },
	         
	        fromBase62: function (x) {
	            var ret = 0;
	            for (j = x.length; j; j--) {
	                var p = -1 * (j - x.length);
	                ret += O.__.base62keystr.indexOf(x.substring(p,p+1)) * Math.pow(62,j-1);
	            }
	            return ret;
	        }
	         
	    });
	 
	    O.extend({
	         
	        toBase62: function () {
	            this.O = O.toBase62(this.O);
	            return this;
	        },
	         
	        fromBase62: function () {
	            this.O = O.fromBase62(this.O);
	            return this;
	        }
	         
	    });
	     
	     
	})(this);
	
It implements two static methods and two objects' methods. Due example of uses:


	var n = 13425;
	// we have a number:
	 
	alert(O.toBase62(n));
	// this return a base62 integer
	 
	alert(O(s).toBase62().end()); 
	// this returns the same value

The method end return the value of the properties O of the object and delete it. 
If we pass an object to the method, it adds to the passed object a properties log 
that contains the log if exist of the specific object. If we don't run end the object 
persists so that we can continue to work on it. For example, we can have something as

	var a = "12345";
	// a numeric string
	 
	var obj = O(a);
	// instantiates the object
	 
	obj.int().toBase62();
	// convert the type of the internal O properties to integer 
	// and after to base62 integer
	 
	alert(obj.end());
	// end the object and returns the value of the internal O properties.
	
## Credits

Francesco Sullo <sullof@sullof.com>

## License 

(The MIT License)

Copyright (c) 2010 Francesco Sullo <sullof@sullof.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
