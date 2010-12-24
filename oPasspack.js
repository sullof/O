(function (thiz) {
	
	var O = thiz.O;

    // just some shortcut:

    O.extend({

            toAESB64: function (key,nbits) {
                    this.toAES(key,nbits).toBase64(1);
                    return this;
            },

            toAESB64esc: function (key,nbits) {
                    this.toAES(key,nbits).toBase64(1).escape();
                    return this;
            },

            toJSONAES: function (key,nbits) {
                    this.toJSON().toAES(key,nbits);
                    return this;
            },

            toJSONAESB64: function (key,nbits) {
                    this.toJSON().toAES(key,nbits).toBase64(1);
                    return this;
            },

            toJSONB64: function () {
                    this.toJSON().toBase64(1);
                    return this;
            },

            toJSONB64Esc: function () {
                this.toJSON().toBase64(1).escape();
                return this;
            },

        	toJSONAESB64esc: function (key,nbits) {
                    this.toJSON().toAES(key,nbits).toBase64(1).escape();
                    return this;
            },

            fromB64AES: function (key,nbits) {
                    this.fromBase64().fromAES(key,nbits);
                    return this;
            },

            fromB64AESObject: function (key,nbits) {
                    this.fromBase64().fromAES(key,nbits).toObject();
                    return this;
            },

            fromAESObject: function (key,nbits) {
                    this.fromAES(key,nbits).toObject();
                    return this;
            }


    });


    O.extend({
    	
    	// for back-compatibility:

        decode: function (method, key, pars) {
            if (!pars) pars = {};
            if (this.O) {
                if (!pars.noBase64) this.O = O.fromBase64(this.O);
                switch (method) {
                    case 'AES':
                        this.O = O.fromAES(
                                this.O.toString(),
                                key,
                                pars.nbits
                        );
                        break;
                    case 'xxTEA':
                        this.O = O.fromTEA(
                                this.O.toString(),
                                key
                        );
                        break;
                }
            }
            return this;
        },

        encode: function (method, key, pars) {
            if (!pars) pars = {};
            if (this.O) {
                switch (method) {
                    case 'AES':
                        this.O = O.toAES(
                                this.O.toString(),
                                key,
                                pars.nbits
                       );
                        break;
                    case 'xxTEA':
                        this.O = O.toTEA(
                                this.O.toString(),
                                key
                        );
                        break;
                }
                if (!pars.noBase64) this.O = O.toBase64(this.O.toString(),1);
            }
            return this;
        }

    });

})(this);