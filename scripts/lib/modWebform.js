
var util = require('scripts/util');
var modFlow = require('scripts/lib/modFlow');
var showItemWebform = function(item, opts) {
    // start code
    var webform = item.webform;
        
    var contentHeight = 1000;
    var uiobj = {
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
                /*{
                    type: "view",
                    props: {
                    bgcolor: $color("red")
                    },
                    layout: (make, view) => {
                    make.left.top.right.equalTo(0);
                    make.height.equalTo(300);
                    }
                }*/
                ]
            }
            ]
        }
        ]
    };

    uiobj.type = 'view';
    uiobj.props = {
        
    };
    uiobj.props.navButtons = [];
    uiobj.props.id = Math.random();
    if(webform.submitBtnName) {
        var navButton = {
            title:webform.submitBtnName,
            icon:'024',
            symbol: "checkmark.seal", // SF symbols are supported
            handler: sender => {
                if(webform.params && webform.params.length) {
                    var formparams = {};
                    for(var i = 0; i < webform.params.length; i++) {
                        var param = webform.params[i];
                        var widget = $(param.name);
                        if(param.type == 'text') {
                            formparams[param.name] = widget.text;
                        }
                        else if(param.type == 'textarea') {
                            formparams[param.name] = widget.text;
                        }
                        else if(param.type == 'hidden') {
                            formparams[param.name] = param.def;
                        }
                        else if(param.type == 'selectone') {
                            var selectedData = widget.data[0];
                            if(param.options.length) {
                                var entries = Object.entries(param.options);
                                var len = entries.length;
                                for(var j = 0; j < len; j++) {
                                    if(entries[j][1] == selectedData) {
                                        var selectedKey = entries[j][1];
                                        formparams[param.name] = selectedKey;
                                    }
                                }
                            }
                            else {
                                var entries = Object.entries(param.options);
                                var len = entries.length;
                                for(var j = 0; j < len; j++) {
                                    if(entries[j][1] == selectedData) {
                                        var selectedKey = entries[j][0];
                                        formparams[param.name] = selectedKey;
                                    }
                                }
                            }
                            
                        }
                    }
                    console.log('endpoint:'+webform.endpoint);
                    console.log('formparams:');
                    console.log(formparams);
                    util.frequest({
                        url: webform.endpoint,
                        method:'POST',
                        params:formparams,
                        callbackJSON : function(json) {
                            if(json.message) {
                                alert(json.message);
                            }
                            if(json.refresh) {
                                if(opts.refresh) opts.refresh();
                            }
                            
                            if(json.webform) {
                                showItemWebform(json, {
                                    refresh:function() {
                                        if(opts.refresh) opts.refresh();
                                    }
                                });
                            }
                            
                            if(json.redirectUrl) {
                                _funcs['showCategory'](json.redirectUrl);
                            }
                            
                            
                            if(json.closewin) {
                                $ui.pop();
                            }
                           
                            // TODO 20210926
                            //#47 submit callback level
                            
                            if(typeof json.flows != 'undefined') {
                                for(var i in json.flows) {
                                    ctx.flows[i] = json.flows[i];
                                }
                            }
                
                            var flow = json.flow;
                            ctx.createFlowEngine(flow).execute(function() {});
                            
                        }
                    });
                }
            }
        };
        uiobj.props.navButtons.push(navButton);
    }
    uiobj.props.title = webform.heading;

    uiobj.events = {};
    var y = 0;
    var height = 40;

    var customHeightLayout = function(height) {
        return (make,view) => {
            make.left.right.equalTo(0);
            make.top.equalTo(y);
            make.height.equalTo(height);
            y += height + 5;
        };
    };
    var widgetLayout = () => {
        return customHeightLayout(height);// default height
    };
    if(webform.params && webform.params.length) {
        // render param widget
        for(var i = 0; i < webform.params.length; i++) {
            var param = webform.params[i];
            var childview = null;
            if(param.type == 'label') {
                childview = {type:'label',props:{text:param.name},layout:widgetLayout()};
                
            }
            else if(param.type == 'text') {
                childview = {type:'text',props:{
                    placeholder:param.name,
                    id:param.name,
                },layout:customHeightLayout(60)};
                if(param.def) {
                    childview.props.text = param.def;
                }
            }
            else if(param.type == 'textarea') {
                childview = {type:'text',props:{
                    placeholder:param.name,
                    id:param.name,
                },layout:customHeightLayout(120)};
                if(param.def) {
                    childview.props.text = param.def;
                }
            }
            else if(param.type == 'selectone') {
                
                var options = [];
                var entries = Object.entries(param.options);
                var len = entries.length;
                for(var j = 0; j < len; j++) {
                    var entry = entries[j];
                    options.push(entry[1]);
                }
                childview = {type:'picker',props:{
                    id:param.name,
                    selectedRows:1,
                    items:[options]
                }, layout:customHeightLayout(60)};
                
            }
            else if(param.type == 'html') {
                childview = {type:'web',props:{
                    id:param.name,
                    html:param.html
                }, layout:customHeightLayout(300)}
            }
            uiobj.views[0].views[0].views.push(childview);
        }
    }
    uiobj.events.appeared = function(s) {
        for(var i = 0; i < webform.params.length; i++) {
            var param = webform.params[i];
            if(param.type == 'selectone' && param.def) {
                if(param.options.length) {
                    var entries = Object.entries(param.options);
                    var len = entries.length;
                    var selectedKey = -1;
                    for(var j = 0; j < len; j++) {
                        var entry = entries[j];
                        if(entry[1] == param.def) {
                            selectedKey = j;
                        }
                    }
                }
                else {
                    var entries = Object.entries(param.options);
                    var len = entries.length;
                    var selectedKey = -1;
                    for(var j = 0; j < len; j++) {
                        var entry = entries[j];
                        if(entry[0] == param.def) {
                            selectedKey = j;
                        }
                    }
                }
                $(param.name).invoke("selectRow:inComponent:animated:",[selectedKey],0,false);
            }
        }
    }
    $ui.push(uiobj);

    var ctx = {}; // context object
	ctx.item = item;
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
		if(typeof flow != 'undefined') {
			if(typeof flow == 'object') {
				// flow object
				return new modFlow.FlowEngine(flow).setContext(ctx);
			}
			else if(typeof flow == 'string') {
				// flow name
				if(typeof ctx.flows[flow] != 'undefined') {
					return new modFlow.FlowEngine(ctx.flows[flow]).setContext(ctx);
				}
			}
		}
		// return dummy function for silent execution
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
	ctx.showItemWebform = showItemWebform;
	ctx.showCategory = _funcs['showCategory'];
	ctx.showWebView = _funcs['showWebView'];
	ctx.showCategoryItems = _funcs['showCategoryItems'];
	ctx.showListChooser = _funcs['showListChooser'];
	ctx.showItemNSPage = _funcs['showItemNSPage'];
	
	// #47 iterate all webform level flows and put into context flow collection
	if(typeof item.flows != 'undefined') {
		for(var i in item.flows) {
			ctx.flows[i] = item.flows[i];
		}
	}
	if(typeof item.pages != 'undefined') {
		for(var i in item.pages) {
			ctx.pages[i] = item.pages[i];
		}
	}
	if(typeof item.webforms != 'undefined') {
		for(var i in item.webforms) {
			ctx.webforms[i] = item.webforms[i];
		}
	}
	if(typeof item.props != 'undefined') {
		for(var i in item.props) {
			ctx.props[i] = item.props[i];
		}
	}
	var flow = item.flow;
	// #47 FlowEngine webform level
	ctx.createFlowEngine(flow).execute(function() {});
	
	// Put in external vars from showItemWebform opts
	if(opts.vars) {
		for(var i in opts.vars) {
			ctx.vars[i] = opts.vars[i];
		}
	}
}
module.exports.showItemWebform = showItemWebform;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}