var util = require('scripts/util');
module.exports = {
	
	process : function(ctx, step, next) {
		console.log('inside evaljs');
		console.log(step.var);
		console.log(step.code);
		if(typeof step.var != 'undefined' && step.code.indexOf('return') == -1) {
			step.code = 'return ' + step.code;
		}
		var isNextWrapperCalled = false;
		var nextWrapper = function() {
			if(isNextWrapperCalled) return;
			setTimeout(next, 1);
			isNextWrapperCalled = true;
		}
		
		var val = new Function('vars', 'ctx', 'util', 'next', 'vars; ctx; util; next; ' + step.code);
		ctx.vars[step.var] = val(ctx.vars, ctx, util, nextWrapper);
		if(typeof step.timeout != 'undefined') {
			setTimeout(nextWrapper, step.timeout);
		}
		else {
			setTimeout(next, 1);
		}
	}
}