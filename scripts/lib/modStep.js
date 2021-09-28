// IMPORT
module.exports = {
	
	processStep : function(ctx, step, next) {
		_processStep(ctx, step, next);
	}
	
};

// public variable
var stepDefinitions = [];

// CONSTANTS
global.STEP_TIMEOUT = 0;

// REGION _processStep

var _processStep = function(ctx, step, next) {
	var pro = new StepProcessor(ctx, step, next);
	pro.process();
}
var StepProcessor = function(ctx, step, next) {
	this.ctx = ctx;
	this.step = step;
	
	var def = null;
	var spec = null;
	var init = function() {
		findDef();
	}
	var findDef = function() {
		if(typeof stepDefinitions[step.type] !== 'undefined') {
			def = stepDefinitions[step.type];
		}
		else {
			try {
				def = require('scripts/lib/steps/' + step.type);
				stepDefinitions[step.type] = def;
			} catch (e) {
				//console.log(e);
			}
		}
	}
	this.process = function() {
		if(def === null) {
			setTimeout(next, 1);
			return;
		}
		console.log('process step: ' + step.type);
		if(step.type == 'setVar') {
			console.log('setVar: ' + step.name + "," + step.value);
		}
		def.process(ctx, step, next);
	}
	init();
}

// ENDREGION _processStep