ResetPwd = (function() {


  var ELS_IDS = {
     RESET : 'reset',
     RESET_PWD_FORM : 'resetPwdForm',
     EMAIL : 'inputEmail',
     GO_BACK_BTN : 'gobackBtn',
     REST_BTN : 'resetBtn'
  };

  var ELS_CLASS = {
     CLOSE : 'close',
     GO_BACK : 'goback' 
  };


  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      goback : function(){
        $('.' + ELS_CLASS.GO_BACK).click(function(){
            chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/login.html"), width : '400px', height : '300px'});
        });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     $('#' + ELS_IDS.RESET_PWD_FORM).ajaxForm(function(data){
        if(data.success){
           $('#' + ELS_IDS.REST_BTN).hide();
           $('#' + ELS_IDS.GO_BACK_BTN).show();
           $('#' + ELS_IDS.EMAIL).replaceWith('<h5>'+ data.success +'</h5>');
        } 
     });
  };
  
  return {
  	init : init
  };

})();
$(document).ready(ResetPwd.init);