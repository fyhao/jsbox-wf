 var util = require('scripts/util');
 var modWebform = require('scripts/lib/modWebform.js');
 var modPage = require('scripts/lib/modPage.js');
module.exports = {
    createBrowser : function() {
        return new Browser();
    }
};
function Browser() {
	this.open = function(obj) {
        console.log('open ' + obj);
		if(typeof obj == 'string') {
			showCategory(obj);
		}
		else if(typeof obj == 'object') {
			if(typeof obj.list != 'undefined') {
				showCategoryItems(obj);
			}
			else if(typeof obj.type != 'undefined') {
				showItem(obj);
			}
		}
	}
}
function showCategoryItems(cat, opts) {
	if(typeof opts == 'undefined') opts = {};
    for(var i = 0; i < cat.list.length; i++) {
        var li = cat.list[i];
        if(li.type == 'category') {
            li.onclick = function(li) {
                showCategory(li.requesturl);
            }
        }
        else if(li.type == 'webform') {
            li.onclick = function(li) {
                showItemWebform(li, {});
            }
        }
        else if(li.type == 'page') {
            
            li.onclick = function(li) {
                if(typeof li.requesturl != 'undefined') {
                    util.frequest({
                        url : li.requesturl,
                        callbackJSON : function(page) {
                            showItemNSPage(page);
                        }
                    });
                }
                else {
                    showItemNSPage(li.page);
                }
            }
        }
    }
    cat.showWebform = showItemWebform;
    util.pushListView(cat);
      // refer list; https://docs.xteko.com/#/component/list

}
function showCategory(url) {
    console.log('showCategory ' + url);
    var loadData = function() {
        util.frequest({
            url : url,
            callbackJSON : function(cat) {
                showCategoryItems(cat, {url:url});
            }
        });
    }
    loadData();
}

function showItemWebform(item, opts) {
    // temporoary write code here later copy to modwebform as save modwebform not auto refresh
    
    //modWebform.dummy();
    modWebform.showItemWebform(item, opts);
    
}

function showItemNSPage(page) {
    console.log('showItemNSPage');
    console.log(page);
    var content = page.content;
    modPage.showItemNSPage(page);
}



function layoutCenter(make,view) {
    make.center.equalTo(view.super);
}

modWebform.setFunc('showCategory', showCategory);
modWebform.setFunc('showCategoryItems', showCategoryItems);
//modWebform.setFunc('showListChooser', showListChooser);
//modWebform.setFunc('showWebView', showWebView);
modWebform.setFunc('showItemNSPage', modPage.showItemNSPage);

modPage.setFunc('showCategory', showCategory);
modPage.setFunc('showCategoryItems', showCategoryItems);
//modPage.setFunc('showListChooser', showListChooser);
//modPage.setFunc('showWebView', showWebView);
modPage.setFunc('showItemNSPage', modPage.showItemNSPage);
