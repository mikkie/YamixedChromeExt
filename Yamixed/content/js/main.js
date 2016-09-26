MAIN = (function() {

  var ELS_IDS = {
  	 MAIN_AREA : 'mainArea',
     BOOK_MARK : 'bookmark',
     GO_SETTING : 'goSetting',
     HOT_KEYS : 'hotkeys',
     ACCOUNT : 'account',
     LOGOUT : 'logout',
     SEL_SPACE : 'selSpace' 
  };	

  var ELS_CLASS = {
     CLOSE : 'close',
     BELL : 'bell' 
  };


  var showPage = function(page,width,height){
     chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL(page), width : width, height : height});
  };

  
  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      book_mark : function(){
         $('#' + ELS_IDS.BOOK_MARK).click(function(){
            showPage("content/newBookmark.html",'600px','600px');
         });
      },
      go_setting : function(){
         $('#' + ELS_IDS.GO_SETTING).click(function(){
            showPage("content/setting.html",'900px','600px');
         });
      },
      bell : function(){
         $('.' + ELS_CLASS.BELL).click(function(){
            showPage("content/bell.html",'600px','600px');   
         });
      },
      hotkeys : function(){
         $('#' + ELS_IDS.HOT_KEYS).click(function(){
            showPage("content/hotkeys.html",'600px','600px');
         });
      },
      account : function(){
         $('#' + ELS_IDS.ACCOUNT).click(function(){
            showPage("content/account.html",'500px','600px');
         });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      }
  };


  var renderHeader = function(){
     //1.render space selector
     chrome.storage.sync.get('userSpace',function(data){
        var options = '';
        if(data.userSpace && data.userSpace.success.length > 0){
           var spaces = data.userSpace.success;
           for(var i in spaces){
              options += '<option name="selSpace" value="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</option>';
           }
        }
        $('#' + ELS_IDS.SEL_SPACE).append(options);
     });

  };

  var renderPage = function(){
     renderHeader();
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     renderPage();
  };
  
  return {
  	init : init
  };

})();
$(document).ready(MAIN.init);