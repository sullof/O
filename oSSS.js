(function (thiz) {
	
	var O = thiz.O;

	O.__.SSS = {
			
/**
*  Shamyr's Shared Secret
*  (maximum quorum = 8)
*  based on Secret Splitting
*  http://www.rlr-uk.com/
**/
	    ks: O.__.Base64._keyStr + "!$",
	    split: function (secret, n, q) {
			var ks = this.ks;
			secret = O.toBase64(secret).replace(/=+$/,'');
	        var ret = [];
	        for (var i = 0; i < n; i++) {
	            ret[i] = ks.charAt(q) + ks.charAt(i + 1);
	        }
	        var pol = [];
	        for (i = 0; i < secret.length; i++) {
	            pol[0] = ks.indexOf(secret.charAt(i));
	            for (var j = 1; j < q; j++) {
	                pol[j] = Math.floor(O.getRandom() * ks.length);
	            }
	            var t;
	            for (j = 0; j < n; j++) {
	                t = 0;
	                for (var l = 0; l < q; l++) {
	                    t += pol[l] * Math.pow(j + 1, l);
	                }
	                t = t % ks.length;
	                ret[j] += ks.charAt(t);
	            }
	        }
	        return ret;
	    },
	    join: function (keys) {
	        var ret = "",
	        	ks = this.ks,
	        	q = ks.indexOf(keys[0].charAt(0)),
	        	Points = [],
	        	t;
	        if (keys.length < q) return 0;  // not quorum 
	        for (j = 0; j < q; j++) {
	            Points[j] = 1.0;
	            for (var l = 0; l < q; l++)
	                if (l != j) {
	                    Points[j] *= -ks.indexOf(keys[l].charAt(1));
	                    t = (ks.indexOf(keys[j].charAt(1)) - ks.indexOf(keys[l].charAt(1)));
	                    for (var m = 1; m < ks.length; m++)
	                        if ((m * ks.length + 1) % t == 0) {
	                            t = ((m * ks.length + 1) / t) % ks.length;
	                            break;
	                        }
	                    Points[j] *= t;
	                }
	        }
	        for (var i = 2; i < keys[1].length; i++) {
	            t = 0;
	            for (j = 0; j < q; j++) t += (ks.indexOf(keys[j].charAt(i)) * 1.0) * Points[j];
	            t = t % ks.length;
	            if (t < 0) t += ks.length;
	            ret += ks.charAt(t);
	        }
	        t = ret.length % 4;
	        ret += t == 2 ? "==" : t == 3 ? "=" : '';
	        return O.isBase64(ret) ? O.fromBase64(ret) : 1;
	    }
	};
	
	O.expand({

    	SSSsplit: function(s,n,q) {
    		return O.__.SSS.split(s,n,q);
    	},
    	
    	SSSjoin: function(o) {
    		return O.__.SSS.join(o);
    	}
    });
	
	O.extend({


		SSSsplit: function (n,q) {
            this.O = O.SSSsplit(this.O.toString(),n,q);
            return this;
	    },
	
		SSSjoin: function () {
            this.O = O.SSSjoin(this.O);
            return this;
	    }
	    
	});

})(this);