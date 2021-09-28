module.exports = {
	
	process : function(ctx, step, next) {
		console.log('setNavButton executed');
        var navButton = {
            title:step.title,
            icon:'024',
            symbol: "checkmark.seal", // SF symbols are supported

        }
        var uiobj = $('navbutton');
        console.log(uiobj)
        ctx.navButton.handler = function() {
            ctx.createFlowEngine(step.flow).execute(function() {});
        }
		setTimeout(next, 1);
	}
}
