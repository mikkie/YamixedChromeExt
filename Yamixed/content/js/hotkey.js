Bell = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    GO_SETTING : 'goSetting',
    LOGOUT : 'logout'
  };	

  var ELS_CLASS = {
     USER_NAME : 'userName',
     CLOSE : 'close' 
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
      goback : function(){
        $('#' + ELS_IDS.GO_BACK).click(function(){
            showPage("content/content.html",'900px','600px');
        });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      },
      go_setting : function(){
         $('#' + ELS_IDS.GO_SETTING).click(function(){
            showPage("content/setting.html",'900px','600px');
         });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     Y_COMMON.render.renderUser('.' + ELS_CLASS.USER_NAME);
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Bell.init);

