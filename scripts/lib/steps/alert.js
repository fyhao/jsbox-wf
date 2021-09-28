module.exports = {
	
	process : function(ctx, step, next) {
		alert(step.message);
		setTimeout(next, 1);
	}
}