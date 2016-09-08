Login = (function() {


  var ELS_IDS = {
     REGISTER : 'register',
     RESET_PWD : 'resetPwd',
     EMAIL_NAME : 'inputEmail',
     PWD : 'inputPassword',
     LOGIN : 'login',
     LOGIN_FORM : 'loginForm'
  };

  var ELS_CLASS = {
     CLOSE : 'close',
     INPUT : 'input' 
  };


  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      register : function(){
        $('#' + ELS_IDS.REGISTER).click(function(){
           chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/register.html"), width : '400px', height : '300px'});
        });
      },
      reset_pwd : function(){
        $('#' + ELS_IDS.RESET_PWD).click(function(){
           chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/resetPwd.html"), width : '400px', height : '200px'});
        });
      },
      resetValide : function(){
        $('.' + ELS_CLASS.INPUT).keyup(function(event){
          if(event.keyCode != 13){
            $('.' + ELS_CLASS.INPUT).each(function(){
              $(this)[0].setCustomValidity('');
            });
          }
        });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     chrome.storage.sync.remove('ym_auto_login');
     $('#' + ELS_IDS.LOGIN_FORM).ajaxForm({
      success : function(data){
        if(data.success){
          chrome.storage.sync.set({"ym_auto_login":{
            email : data.success.email,
            token : data.success.autoLoginToken
          }});
          chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/content.html"), width : '900px',height : '600px'});  
        }
        else if(data.error_user){
          $('#' + ELS_IDS.EMAIL_NAME)[0].setCustomValidity(data.error_user);
        }
        else if(data.error_pwd){
          $('#' + ELS_IDS.PWD)[0].setCustomValidity(data.error_pwd);
        }
      }
    }); 
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Login.init);