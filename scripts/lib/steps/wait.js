module.exports = {
	
	process : function(ctx, step, next) {
		setTimeout(next, step.timeout);
	}
}