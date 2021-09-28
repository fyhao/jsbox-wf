var propParser = require('scripts/lib/helperPropParser');

var modFlow = require('scripts/lib/modFlow');
var modWebform = require('scripts/lib/modWebform');

function showItemNSPage(itemPage) {

    ctx.itemPage = itemPage;
	ctx.showItemWebform = modWebform.showItemWebform;
	ctx.showCategory = _funcs['showCategory'];
	ctx.showWebView = _funcs['showWebView'];
	ctx.showCategoryItems = _funcs['showCategoryItems'];
	ctx.showListChooser = _funcs['showListChooser'];
	ctx.showItemNSPage = _funcs['showItemNSPage'];
	if(typeof itemPage.flows != 'undefined') {
		for(var i in itemPage.flows) {
			ctx.flows[i] = itemPage.flows[i];
		}
	}
	if(typeof itemPage.pages != 'undefined') {
		for(var i in itemPage.pages) {
			ctx.pages[i] = itemPage.pages[i];
		}
	}
	if(typeof itemPage.webforms != 'undefined') {
		for(var i in itemPage.webforms) {
			ctx.webforms[i] = itemPage.webforms[i];
		}
	}
	if(typeof itemPage.props != 'undefined') {
		for(var i in itemPage.props) {
			ctx.props[i] = itemPage.props[i];
		}
	}


    var contentHeight = 1000;
    var uiobj = {
        type:'view',
        props:{
            id:'mainpageview'
        },
        views: [
          {
            type: "scroll",
            layout: $layout.fill,
            events: {
              layoutSubviews: sender => {
                $("container").frame = $rect(0, 0, sender.frame.width, contentHeight);
              }
            },
            views: [
              {
                type: "view",
                props: {
                  id: "container"
                },
                views: [
                  
                ]
              }
            ]
          }
        ]
      };
    
    uiobj.type = 'view';
    
    uiobj.props.navButtons = [];
    var navButton = {
        title:'test',
        icon:'024',
        symbol: "checkmark.seal", // SF symbols are supported
        handler : function() {
            
        }
    }
    ctx.navButton = navButton;
    //var uiobj = $('mainpageview');
    //console.log(uiobj)
    uiobj.props.navButtons.push(navButton);

    uiobj.events = {};
    
	itemPage.comp = {
        type:'view',
        layout: $layout.fill,
        views:[]
    }; // parent comp
	processComponents(itemPage);
    uiobj.views[0].views[0].views.push(itemPage.comp);
    console.log('UI comp to push');
    console.log(uiobj);
	$ui.push(uiobj);
    // TODO below maybe can run in ui appeared event
    uiobj.events.appeared = function(s) {
        var flow = itemPage.flow;
        console.log('itempage flow');
        console.log(flow);
        console.log('after 500 createflowengine')
        ctx.createFlowEngine(flow).execute(function() {});
    
    };
    
}
function processComponents(itemPage) {
    //console.log('processComponents entry');
    //console.log(itemPage);
	if(itemPage.content) {
		processContent(itemPage);
	}
	if(itemPage.childs) {
		processChilds(itemPage);
	}
}

function processContent(itemPage) {
    //console.log('processContent entry:');
    //console.log(itemPage);
	processType(itemPage.content);
	itemPage.comp.views.push(itemPage.content.comp);
    //console.log('processContent after');
    //console.log(itemPage);
}
function processChilds(itemPage) {
    //console.log('processChilds entry:');
    //console.log(itemPage);
	if(itemPage.childs.length) {
		itemPage.childs.forEach(function(child) {
			processType(child);
            //console.log('inside child after process type');
            //console.log(itemPage);
			itemPage.comp.views.push(child.comp);
		});
	}
}

/*## PROCESS TYPE ##*/
function processType(c) {
	//console.log("DEBUG processType: " + JSON.stringify(c));
    c.comp = {};
	c.processType = processType;
	c.ctx = ctx;
	var dec = require('scripts/lib/components/' + c.type);
	dec.process(c);
	for(var i in c) {
		if(typeof c[i] == 'string') {
			c[i] = propParser.parse(ctx, c[i]);
		}
	}
	//processParamIntoComp(c);
	processTapable(dec, c);
	processOnEvent(c);
	processComponents(c);
	if(dec.postComponentProcess) dec.postComponentProcess(c);
}
function processParamIntoComp(c) {
	for(var key in c) {
		if(key == 'comp') continue;
		if(key == 'flow') continue;
		if(key == 'type') continue;
		c.comp[key] = c[key];
	}
}
function processTapable(dec, c) {
	if(dec.tapable) {
		c.comp.on(buttonModule.Button.tapEvent, function (args) {
			var flow = c.tap;
			ctx.createFlowEngine(flow).execute(function() {});
		});
	}
}

function processOnEvent(c) {
	for(var k in c) {
		if(k.startsWith("event.")) {
			var eventName = k.substring('event.'.length);
			c.comp.off(eventName);
			var fn = function(flow) {
				return function(args) {
					console.log('processOnEvent:' + eventName + ':' + flow);
					ctx.vars['_args'] = args;
					ctx.createFlowEngine(flow).execute(function() {});
				};
			}
			c.comp.on(eventName, fn(c[k]));
		}
	}
}
var _funcs = {};

var ctx = {}; // context object

ctx.flows = {};
ctx.webforms = {};
ctx.pages = {};
ctx.vars = {};
ctx.blobVars = {};
ctx._logs = [];
ctx.props = {};
ctx.FLOW_ENGINE_CANCELED_notification_queues = [];

ctx.enable_FLOW_ENGINE_CANCELLED = function() {
	var queues = ctx.FLOW_ENGINE_CANCELED_notification_queues;
	if(queues && queues.length) {
		for(var i = 0; i < queues.length; i++) {
			queues[i]();
		}
	}
}
ctx.createFlowEngine = function(flow) {
    console.log('modPage createFlowEngine');
    console.log(flow);
	if(typeof flow != 'undefined') {
		if(typeof flow == 'object') {
			// flow object
            console.log('flowobject');
			return new modFlow.FlowEngine(flow).setContext(ctx);
		}
		else if(typeof flow == 'string') {
			// flow name
			if(typeof ctx.flows[flow] != 'undefined') {
                console.log('flow name');
				return new modFlow.FlowEngine(ctx.flows[flow]).setContext(ctx);
			}
		}
	}
	// return dummy function for silent execution
    console.log('dummy silent')
	return {
		execute : function(next) {
			if(next.length == 1) {
				setTimeout(function() {
					next({});
				}, 1);
			}
			else {
				setTimeout(next, 1);
			}
		}
		,
		setInputVars : function(_vars){
			return this;
		}
	};
}



module.exports.showItemNSPage = showItemNSPage;

module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}