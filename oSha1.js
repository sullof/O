(function (thiz) {

	
	var O = thiz.O;
     


	O.__.SHA1 = {

		hash: function (msg) {
			// constants [4.2.1]
			var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
		
			// PREPROCESSING 
		 
			msg += String.fromCharCode(0x80); // add trailing '1' bit to string [5.1.1]
		
			// convert string msg into 512-bit/16-integer blocks arrays of ints [5.2.1]
			var l = Math.ceil(msg.length/4) + 2;  // long enough to contain msg plus 2-word length
			var N = Math.ceil(l/16);              // in N 16-int blocks
			var M = new Array(N);
			for (var i=0; i<N; i++) {
				M[i] = new Array(16);
				for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
					M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
							  (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
				}
			}
			// add length (in bits) into final pair of 32-bit integers (big-endian) [5.1.1]
			M[N-1][14] = ((msg.length-1) >>> 30) * 8;
			M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
		
			// set initial hash value [5.3.1]
			var H0 = 0x67452301;
			var H1 = 0xefcdab89;
			var H2 = 0x98badcfe;
			var H3 = 0x10325476;
			var H4 = 0xc3d2e1f0;
		
			// HASH COMPUTATION [6.1.2]
		
			var W = new Array(80);
			var a, b, c, d, e;
			for (var i=0; i<N; i++) {
		
				// 1 - prepare message schedule 'W'
				for (var t=0;  t<16; t++) W[t] = M[i][t];
				for (var t=16; t<80; t++) W[t] = this.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
		
				// 2 - initialise five working variables a, b, c, d, e with previous hash value
				a = H0; b = H1; c = H2; d = H3; e = H4;
		
				// 3 - main loop
				for (var t=0; t<80; t++) {
					var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
					var T = (this.ROTL(a,5) + this.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
					e = d;
					d = c;
					c = this.ROTL(b, 30);
					b = a;
					a = T;
				}
		
				// 4 - compute the new intermediate hash value
				H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
				H1 = (H1+b) & 0xffffffff; 
				H2 = (H2+c) & 0xffffffff; 
				H3 = (H3+d) & 0xffffffff; 
				H4 = (H4+e) & 0xffffffff;
			}
		
			return O.toHexstr(H0) + O.toHexstr(H1) + O.toHexstr(H2) + O.toHexstr(H3) + O.toHexstr(H4);
		},
		
		//
		// function 'f' [4.1.1]
		//
		f: function (s, x, y, z) {
			switch (s) {
				case 0: return (x & y) ^ (~x & z);
				case 1: return x ^ y ^ z;
				case 2: return (x & y) ^ (x & z) ^ (y & z);
				case 3: return x ^ y ^ z;
			}
		},
		
		//
		// rotate left (circular left shift) value x by n positions [3.2.5]
		//
		ROTL: function (x, n) {
			return (x<<n) | (x>>>(32-n));
		}
	};
	
	

    O.expand({

            toSHA1: function (str) {
                    return O.__.SHA1.hash(str);
            }


    });


    O.extend({

            toSHA1: function () {
                    this.O = O.toSHA1(this.O);
                    return this;
            }


    });

})(this);