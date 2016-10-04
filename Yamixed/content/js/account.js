Account = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    USER_NAME : 'username',
    SEL_SPACE : 'selSpace',
    EMAIL : 'email',
    SAVE : 'save',
    FORM : 'saveAccountForm',
    USER_ID : 'userId'
  };	

  var ELS_CLASS = {
     USER_NAME : 'userName',
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
            chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/content.html"), width : '900px',height : '600px'});
        });
      }
  };

  var renderHeader = function(){
     Y_COMMON.render.renderUser('.' + ELS_CLASS.USER_NAME);
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
              if(space.defaultSpace){
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
     $('#' + ELS_IDS.FORM).ajaxForm(function(data){
        if(data.success){
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
$(document).ready(Account.init);