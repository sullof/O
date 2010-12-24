
(function (thiz) {
	
	var O = thiz.O;

	O.expand({
	
	
		getBits: function (passphrase) {
	
	// inspired by Keepass (http://keepass.info/)
	
			if (!passphrase) return 0;
			var cset = [], ci = [0,32,33,47,48,57,58,64,65,90,91,96,97,122,123,126,126,255,256,65535],
				t, ok, factor, df, vdf = [], vcc = [], el=0, bpc, ext, exdf;
			for (var i=0;i<passphrase.length;i++) {
				factor = 1;
				ok = 0;
				t = passphrase.charCodeAt(i);
				for (var j=0;j<ci.length;j+=2) {
					var cc = ci[j];
					if (t>=ci[j] && t<=ci[j+1]) {
						cset[''+j] = ci[j+1]-ci[j];
						ok = 1;
						break;
					}
				}
				if (!ok) cset['x'] = 65280;
				if (i >= 1) {
					df = t - ext;
					if (exdf == df) vdf[df] = 1;
					else {
						vdf[df] = (vdf[df]?vdf[df]:0) + 1;
						factor /= vdf[df];
					}
				}
				if (!vcc[t]) {
					vcc[t] = 1;
					el += factor;
				}
				else el += factor * (1 / ++vcc[t]);
				exdf = df;
				ext = t;
			}
			var tot = 0;
			for (var i in cset) if (!isNaN(parseInt(i,10))) tot += cset[i];
			if (!tot) return 0;
			return Math.ceil(el * Math.log(tot) / Math.log(2));
		}
	
	    
	});

})(this);