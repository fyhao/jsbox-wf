module.exports = {
    frequest : function(opts) {
        if(typeof opts == 'undefined') opts = {};
        if(typeof opts.params == 'undefined') opts.params = '';
        
          
		    if(typeof opts.headers == 'undefined') opts.headers = {};
		    opts.headers['X-WFClient-Version'] = "jsbox-1.0";//util.getVersionString();
        if(typeof opts.headers['Content-Type'] == 'undefined') {
          opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          var temp = '';
          var comma = '';
          for(var i in opts.params) {
              var v = opts.params[i];
              temp += comma;
              temp += i + '=' + v;
              comma = '&';
          }
          opts.params = temp;
      
        }
        var isMocked = false;
        if(isMocked) {
          var mocked = require('scripts/util_mockfrequest');
          mocked.mock_frequest(opts);
        }
        else {
          // url, method, 
          console.log('http request: ' + opts.url);
          console.log(opts);
          $http.request({
            url: opts.url,
            method: opts.method,
            header: opts.headers,
            body: opts.params,
            handler : function(resp) {
              console.log('http resp:');
              console.log(resp);
              if(typeof opts.callbackJSON !== 'undefined') {
                var respdata = resp.data;
                if(typeof resp.data == 'string') {
                  respdata = JSON.parse(resp.data);
                }
                if(opts.callbackJSON.length == 2) {
                  opts.callbackJSON(respdata, resp);
                }
                else {
                  opts.callbackJSON(respdata);
                }
              }
              else if(typeof opts.callback !== 'undefined') {
                if(opts.callback.length == 2) {
                  opts.callback(resp.data, resp);
                }
                else {
                  opts.callback(resp.data);
                }
              }
            }
          });
        }
    },

    pushListView : function(opts) {
        if(typeof opts == 'undefined') opts = {};
        // handle .list, .customMenus
        var data = opts.list;
        for(var i = 0; i < data.length; i++) {
            var d = data[i];
            d.id = Math.random();
            if(d.title) {
                d.label = {text:d.title};
            }
        }
        var listview = {
            type: "list",
            props: {
              data: data
              ,
              template: {
                props: {
                  bgcolor: $color("clear")
                },
                views: [
                  {
                    type: "label",
                    props: {
                      id: "label",
                      bgcolor: $color("#474b51"),
                      textColor: $color("#abb2bf"),
                      align: $align.center,
                      font: $font(32)
                    },
                    layout: $layout.fill,
                  }
                ]
              },
            }, // end of props
            layout: $layout.fill,
            events : {
                didSelect: function(sender, indexPath, sdata) {
                    //alert(JSON.stringify(sdata));
                    // use below workaround to run function in data, as in sdata function will {}
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].id == sdata.id) {
                            // found targetdata
                            var tdata = data[i];
                            if(tdata.onclick) {
                                tdata.onclick(tdata);
                            }
                        }
                    }
                }
            }
          };
          
          var mainview = {type:'view',props:{},views:[listview]};
          mainview.props.navButtons = [];
          if(opts.customMenus && opts.customMenus.length) {
              
              var navButton = {
                title:'Options',
                icon:'024',
                symbol: "checkmark.seal",
                handler: sender => {
                  var menuobj = {
                    items: [],
                    handler: function(title, idx) {
                      var m = opts.customMenus[idx];
                      if(m.webform) {
                        opts.showWebform(m,{});
                      }
                    },
                    finished: function(cancelled) {
                      
                    }
                  };
                  for(var i = 0; i < opts.customMenus.length; i++) {
                    var m = opts.customMenus[i];
                    menuobj.items.push(m.title);
                  }
                  
                  $ui.menu(menuobj)
                  /*if(this.menu.url) {
                    showWebView(this.menu.url);
                  }
                  if(this.menu.requesturl) {
                    showCategory(this.menu.requesturl);
                  }
                  if(this.menu.webform) {
                    modWebform.showItemWebform(this.menu.webform);
                  }
                  if(this.menu.supportOffline) {
                    var url = opts.url || null;
                    modOfflinePage.addPageInCategory(cat, url);
                  }*/
                }
              };
              
              mainview.props.navButtons.push(navButton);
            
          }
          $ui.push(mainview);
    },
    clone : function clone(item) {
      if (!item) { return item; } // null, undefined values check
  
      var types = [ Number, String, Boolean ], 
        result;
  
      // normalizing primitives if someone did new String('aaa'), or new Number('444');
      types.forEach(function(type) {
        if (item instanceof type) {
          result = type( item );
        }
      });
  
      if (typeof result === "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
          result = [];
          item.forEach(function(child, index, array) { 
            result[index] = clone( child );
          });
        } else if (typeof item === "object") {
          // testing that this is DOM
          if (item.nodeType && typeof item.cloneNode === "function") {
            item.cloneNode( true );    
          } else if (!item.prototype) { // check that this is a literal
            if (item instanceof Date) {
              result = new Date(item);
            } else {
              // it is an object literal
              result = {};
              for (var i in item) {
                result[i] = clone( item[i] );
              }
            }
          } else {
            result = item;
          }
        } else {
          result = item;
        }
      }
  
      return result;
    },
    replaceAll : function(s, n,v) {
      while(s.indexOf(n) != -1) {
        s = s.replace(n,v);
      }
      return s;
    },
    showOptionDialog : function(options, opts) {
      if(typeof opts == 'undefined') opts = {};
      var items = [];
      for(var i = 0; i < options.length; i++) {
        var o = options[i];
        if(typeof o === 'string') {
          items.push(o);
        } else if(o && typeof o.text !== 'undefined') {
          items.push(o.text);
        } else {
          items.push('');
        }
      }
      var menuobj = {
        items: items,
        handler: function(title, idx) {
          var selectedOption = options[idx];
          var result = title;
          if(opts && typeof opts.doneResult === 'function') {
            opts.doneResult(result, selectedOption);
          }
        },
        finished: function(cancelled) {
          if(cancelled && opts && typeof opts.doneResult === 'function') {
            opts.doneResult('cancel', null);
          }
        }
      };
      if(opts.message) {
        menuobj.title = opts.message;
      }
      $ui.menu(menuobj);
    }
};
