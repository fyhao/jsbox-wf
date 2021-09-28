var crypto = require('scripts/crypto');
var Aes = crypto.Aes;
var _password = '8j38hw390joew84';
module.exports = {
	
	process : function(ctx, step, next) {
		var password = _password;
		if(typeof step.password != 'undefined') {
			password = ctx.vars[step.password];
		}
		if(step.action == 'encrypt') {
			var ciphered = Aes.Ctr.encrypt(ctx.vars[step.plaintext], password, 128);
			ctx.vars[step.ciphered] = ciphered;
		}
		else if(step.action == 'decrypt') {
			var deciphered = Aes.Ctr.decrypt(ctx.vars[step.ciphertext], password, 128);
			ctx.vars[step.deciphered] = deciphered;
		}
		setTimeout(next, global.STEP_TIMEOUT);
	}
}