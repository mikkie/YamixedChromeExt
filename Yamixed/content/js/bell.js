Bell = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    GO_SETTING : 'goSetting' 
  };	

  var ELS_CLASS = {
     CLOSE : 'close' 
  };


  var showPage = function(page,width){
     chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL(page), width : width});
  };
  
  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      goback : function(){
        $('#' + ELS_IDS.GO_BACK).click(function(){
            showPage("content/content.html",'900px');
        });
      },
      go_setting : function(){
         $('#' + ELS_IDS.GO_SETTING).click(function(){
            showPage("content/setting.html",'900px');
         });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Bell.init);