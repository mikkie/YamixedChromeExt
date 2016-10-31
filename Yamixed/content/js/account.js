Account = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    USER_NAME : 'username',
    SEL_SPACE : 'selSpace',
    EMAIL : 'email',
    LOGOUT : 'logout',
    SAVE : 'save',
    FORM : 'saveAccountForm',
    USER_ID : 'userId',
    SAVE : 'save',
    PASSWORD : 'password'
  };	

  var ELS_CLASS = {
     USER_NAME : 'userName',
     CLOSE : 'close',
     AVATAR : 'avatar' 
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
            chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/content.html"), width : '900px',height : '600px'});
        });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      },
      save : function(){
        $('#' + ELS_IDS.FORM).submit(function(data){
          var $pwd = $('#' + ELS_IDS.PASSWORD);
          var pwd = $pwd.val();
          if(pwd && !/^.{6,}$/.test(pwd)){
             $pwd.focus();
             return false;
          }
          $(this).ajaxSubmit({
            success : function(data){
              if(data.success){
                Service.getUserSpaces(data.success.space).done(function(){
                  Y_COMMON.service.syncLocalData(function(){
                    chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/content.html"), width : '900px',height : '600px'});
                  });
                });
              }
            }
          });
          return false; 
        });
      }
  };

  var renderHeader = function(){
     Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
  };

  var renderBody = function(){
    chrome.storage.sync.get('user',function(data){
       if(data.user){
         $('#' + ELS_IDS.USER_ID).val(data.user._id);
         $('#' + ELS_IDS.USER_NAME).val(data.user.userName);
         $('#' + ELS_IDS.EMAIL).val(data.user.email);
       }  
    });
    chrome.storage.sync.get('userSpace',function(data){
        var options = '';
        if(data.userSpace && data.userSpace.success.length > 0){
           var spaces = data.userSpace.success;
           for(var i in spaces){
              var space = spaces[i];
              if(space.defaultSpace && space.userId == $('#' + ELS_IDS.USER_ID).val()){
                 options = '<option name="spaceId" value="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</option>' + options;
              }
              else{
                 options += '<option name="spaceId" value="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</option>';
              }
           }
           $('#' + ELS_IDS.SEL_SPACE).append(options);
        }
    });
  };

  var renderPage = function(){
     renderHeader();
     renderBody();
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
$(document).ready(Account.init);