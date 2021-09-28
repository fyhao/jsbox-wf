module.exports = {
    run : function() {
        // draw tab bar
        // first one is render url browser
        // second one show page to edit url store in preferences
        renderUI();
        var browser = require('scripts/browser').createBrowser();
        browser.open('xxx');
    }
};
function renderUI() {
    $ui.render({
        views: [
          {
            type: "tab",
            props: {
              id:'tab',
              items: ["item 1","item 2"],
              dynamicWidth: true, // dynamic item width, default is false
            },
            layout: function(make) {
              make.left.top.right.equalTo(0)
              make.height.equalTo(44)
            },
            events: {
              changed: function(sender) {
                const items = sender.items;
                const index = sender.index;
                $ui.toast(`${index}: ${items[index]}`)
                hideAllTabs();
                $(tabbedViews[index]['id']).hidden = false;
              }
            },
            
          }, // end of tab
          createTabChildView({id:'tab1',view:createview1}),
          createTabChildView({id:'tab2',view:createview2}),
        ],
        events: {
            appeared: function() {
                hideAllTabs();
                $('tab1').hidden = false;
            },
        }
      })
      
}

var tabbedViews = [];
function createTabChildView(opts) {
    opts.view = opts.view(opts.id);
    tabbedViews.push(opts);
    return opts.view;
}
function hideAllTabs() {
    for(var i = 0; i < tabbedViews.length; i++) {
        $(tabbedViews[i].id).hidden = true;
    }
}
function showTab(tabid) {
    $(tabid).hidden = false;
}

function createview1(id) {
    var view = {type:'view',props:{id:id}};
    return view;
}
function createview2(id) {
    return testCommonView(id);
}

function layoutCenter(make,view) {
    make.center.equalTo(view.super);
}
function testCommonView(a) {
    return {
        type:'view',
        props:{
            id:a
        },
        views:[
            createLabel("test" + a)
        ],
        layout : layoutCenter
    }
}

function createLabel(text) {
    return {
        type:'label',
        props:{text:text},
        layout : layoutCenter
    };
}

// reference:https://docs.xteko.com/#/component/menu?id=type-quottabquot-amp-type-quotmenuquot
