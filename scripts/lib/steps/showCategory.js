module.exports = {
	
	process : function(ctx, step, next) {
		if(step.url) {
			ctx.showCategory(step.url);
		}
		else if(step.cat) {
			ctx.showCategoryItems(step.cat);
		}
		setTimeout(next, global.STEP_TIMEOUT);
	}
}