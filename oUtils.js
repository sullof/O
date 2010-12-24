(function (thiz) {

	
	var O = thiz.O;
     


	O.expand({
	
	
		charMatrix: {
			lcase: [97,122],
			ucase: [65,90],
			nums: [48,57],
			symb: [33,33,35,47,58,64,91,96,123,126],
			space: [161,254]
		},
	
		passGenerator: function (chars,n) {
			var str = "", v;
			for (var j in chars) {
				var M = O.charMatrix[j];
				for (var u=0;u<M.length;u+=2) {
					for (var y=M[u];y<=M[u+1];y++) {
						str += String.fromCharCode(y);
					}
				}
			}
			var pass = '';
			if (str) {
				var l = str.length,
					p = 0;
				for (p=0;p<n;) {
					v = Math.floor(Math.random() * l);
					if (v == l) continue;
					var c = str.substring(v,v+1);
					pass += c;
					p++;
				}
			}
			return pass;
		},
	
		simplePassGenerator: function (n) {
			return O.passGenerator({
					lcase: 1,
					ucase: 1,
					nums: 1
				},n?n:16);
		},
	
		genRandomKey: function (x, salt, nohex) {
			var l = x && x < 64 ? x : 64,
				ret = O.salthash(
					O.passGenerator({
						lcase: 1,
						ucase: 1,
						nums: 1,
						symb: 1,
						space: 1
					},256),'',salt, nohex)
					.substring(0,l);
			return ret;
		},
	
		salthash: function (str,n,salt,nohex) {
			if (!salt) for (var j=0;j<str.length;j++) salt += str.charCodeAt(j);
			var ss = O.toSHA256(salt+str);
			if (n) ss = ss.substring(0,n);
			return nohex ? O.toStr(ss) : ss;
		}
	
	
	
	
	});
	


})(this);