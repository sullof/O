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