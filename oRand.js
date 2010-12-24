(function (thiz) {
	
	var O = thiz.O;

// prng4.js - uses Arcfour as a PRNG
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

	O.__.PRNG4 = {
		
		Arcfour: function () {
			this.i = 0;
			this.j = 0;
			this.S = new Array();
		
		// Initialize arcfour context from key, an array of ints, each from [0..255]
			this.init = function (key) {
			  var i, j, t;
			  for(i = 0; i < 256; ++i)
				this.S[i] = i;
			  j = 0;
			  for(i = 0; i < 256; ++i) {
				j = (j + this.S[i] + key[i % key.length]) & 255;
				t = this.S[i];
				this.S[i] = this.S[j];
				this.S[j] = t;
			  }
			  this.i = 0;
			  this.j = 0;
			};
	
			this.next = function () {
			  var t;
			  this.i = (this.i + 1) & 255;
			  this.j = (this.j + this.S[this.i]) & 255;
			  t = this.S[this.i];
			  this.S[this.i] = this.S[this.j];
			  this.S[this.j] = t;
			  return this.S[(t + this.S[this.i]) & 255];
			};
		}
		,
		
		// Plug in your RNG constructor here
		prng_newstate: function () {
			return new this.Arcfour();
		}
		,
		
		// Pool size must be a multiple of 4 and greater than 32.
		// An array of bytes the size of the pool will be passed to init()
		rng_psize: 256
	
	};


//Random number generator - requires a PRNG backend, e.g. prng4.js
//Copyright (c) 2005  Tom Wu
//All Rights Reserved.
//See "LICENSE" for details.

//For best results, put code like
//<body onClick='O.timeSeed();' onKeyPress='O.timeSeed();'>
//in your main HTML document.

	O.__.RNG = {
	
		rng_state: null,
		rng_pool: [],
		rng_pptr: 0,
		
		// Mix in a 32-bit integer into the pool
		rng_seed_int: function (x) {
			var RNG = O.__.RNG;
			RNG.rng_pool[RNG.rng_pptr++] ^= x & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 8) & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 16) & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 24) & 255;
			if(RNG.rng_pptr >= O.__.PRNG4.rng_psize) RNG.rng_pptr -= O.__.PRNG4.rng_psize;
		}
		,
		
		// Mix in the current time (w/milliseconds) into the pool
		rng_seed_time: function () {
			O.__.RNG.rng_seed_int(new Date().getTime());
		}
		,
		
		// Initialize the pool with junk if needed.
		pool_init: function () {
		  var t, RNG = O.__.RNG;
		  var nav = typeof navigator != 'undefined' ? navigator : {};
		  var win = typeof window != 'undefined' ? window : {};
		  while(RNG.rng_pptr < O.__.PRNG4.rng_psize) {  // extract some randomness from Math.random()
			t = Math.floor(65536 * Math.random());
			RNG.rng_pool[RNG.rng_pptr++] = t >>> 8;
			RNG.rng_pool[RNG.rng_pptr++] = t & 255;
		  }
		  RNG.rng_pptr = 0;
		  RNG.rng_seed_time();
		  RNG.rng_seed_int(win.screenX);
		  RNG.rng_seed_int(win.screenY);
		}
		,
		
		rng_get_byte: function () {
               var RNG = O.__.RNG;
		  if(RNG.rng_state == null) {
			RNG.rng_seed_time();
			RNG.rng_state = O.__.PRNG4.prng_newstate();
			RNG.rng_state.init(RNG.rng_pool);
			for(RNG.rng_pptr = 0; RNG.rng_pptr < RNG.rng_pool.length; ++RNG.rng_pptr)
			  RNG.rng_pool[RNG.rng_pptr] = 0;
			RNG.rng_pptr = 0;
			//RNG.rng_pool = null;
		  }
		  // TODO: allow reseeding after first request
		  return RNG.rng_state.next();
		}
		
	};

	O.__.RNG.pool_init();


    O.expand({

    	timeSeed: function() {
    		O.__.RNG.rng_seed_time();
    	},
    	
		SecureRandom: function () { // object used by RSA
			this.nextBytes = function (ba) {
				var i;
				for(i = 0; i < ba.length; ++i) ba[i] = O.__.RNG.rng_get_byte();
			};
		},

        getRandom: function (iterations) {
			var ret = "",
				n = iterations ? iterations : 1;
			for (var j=0;j<n;j++) {
				var rng = new O.SecureRandom(),
					b = [],
					x = [],
					n;
				b[16] = 1;
				n = b.length;
			    while (n > 0) { // random non-zero pad
			        x[0] = 0;
			        while (x[0] == 0) rng.nextBytes(x);
			        b[--n] = x[0];
			    }
			    var r = b.join('').substring(1);
			    if (iterations) ret += r;
			    else return parseFloat("0."+r,10);
			}
			return ret;
		}		
		
    });

})(this);

