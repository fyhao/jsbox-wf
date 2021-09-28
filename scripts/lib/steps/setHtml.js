module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = step.value;
		$(step.name).html = step.value;
        setTimeout(next, 1);
	}
}