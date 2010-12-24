(function (thiz) {

    /*
     * O - a chained thought
     * version 1.2, 31 november 2009 - http://o.sullof.com
     * Copyright (c) 2008+ Francesco Sullo
     * Licensed as Open Source under MIT License
     */

    var _O = thiz.O,
    
	    O = thiz.O = function (o) {
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

 	// This extends object's methods:

     O.extend = function () {
         for (var j in arguments[0])
             O._[j] = arguments[0][j];
     };

})(this);

