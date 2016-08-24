Login = (function() {

  var ELS_CLASS = {
     CLOSE : 'close' 
  };


  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
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
$(document).ready(Login.init);