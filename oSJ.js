(function (thiz) {

	var O = thiz.O;
	
	// this requires oBase64.js

	O.__.SJ = {
			
	    rand: function (n) {
            var ret = "";
            for (var j=0;j<n;j++) 
                ret += O.__.Base64._keyStr.charAt(Math.floor(O.getRandom() * 64));
            return ret;
        },
        
        run: function (key) {
            var ret = "", i,
        		ks =  O.__.Base64._keyStr;
            for (var j=0;j<key[0].length;j++) {
                i = ks.indexOf(key[0].charAt(j)) ^ ks.indexOf(key[1].charAt(j));
                ret += ks.charAt(i < 64 ? i : 64);
            }
            return ret;
        }
	};

	O.expand({

    	keySplit: function(s) {
			s = O.toBase64(s);
	        var r = O.__.SJ.rand(s.length);
	        return [O.__.SJ.run([s,r]), r];
    	},
    	
    	keyJoin: function(a) {
    		return O.fromBase64(O.__.SJ.run(a)); 
    	}
    });
	
	O.extend({
		
		keySplit: function () {
            this.O = O.keySplit(this.O.toString());
            return this;
	    },
	
		keyJoin: function () {
            this.O = O.keyJoin(this.O);
            return this;
	    }
	    
	});

})(this);