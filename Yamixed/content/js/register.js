Register = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    USER_NAME : 'username',
    EMAIL : 'inputEmail',
    DO_REGISTER : 'doRegister',
    PWD : 'inputPassword',
    FORM : 'newUserForm'
  };

  var ELS_CLASS = {
     CLOSE : 'close' 
  };


  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      goback : function(){
        $('#' + ELS_IDS.GO_BACK).click(function(){
            chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/login.html"), width : '400px',height : '300px'});
        });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     $('#' + ELS_IDS.FORM).ajaxForm(function(data){
        if(data.success){
          chrome.storage.sync.set({"user" : data.success});
          Service.getUserSpaces(data.success.space).done(function(){
             chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/content.html"), width : '900px',height : '600px'});
          });
        } 
     });
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Register.init);