Bell = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    GO_SETTING : 'goSetting',
    LOGOUT : 'logout',
    MSG_LIST : 'msgList'
  };	

  var ELS_CLASS = {
     USER_NAME : 'userName',
     JOIN_SPACE : 'joinSpace',
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
      },
      removeMessage : function(){
        $('#' + ELS_IDS.MSG_LIST).on('click','a button',function(){
           var $item = $(this).parents('.list-group-item');
           Service.disableMessage($item.attr('messageId')).done(function(data){
              if(data.success){
                 $item.remove();
                 var $list = $('#' + ELS_IDS.MSG_LIST);
                 if($list.children().length == 0){
                    $list.append('<a href="javascript:void(0);" class="list-group-item"><h4 class="list-group-item-heading">亲，没有新消息。</h4></a>');
                 } 
              }
           });
        });
      },
      joinSpace : function(){
        $('#' + ELS_IDS.MSG_LIST).on('click','.' + ELS_CLASS.JOIN_SPACE,function(){
           var userId = $(this).attr('userId');
           var spaceId = $(this).attr('spaceId');
           Service.joinSpace(userId,spaceId);
        });
      }
  };

  var renderPage = function(){
      Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
      Y_COMMON.service.getLogindUser(function(data){
         var $list = $('#' + ELS_IDS.MSG_LIST);
         $list.empty();
         if(data.user){
           Service.getMessagesToUser(data.user._id).done(function(data){
              if(data.success && data.success.length > 0){
                 var messages = data.success;
                 var html = '';
                 for(var i in messages){
                    var message = messages[i];
                    html += $(message.content).attr('messageId',message._id)[0].outerHTML;
                 }
                 $list.append(html);
              }
              else{
                $list.append('<a href="javascript:void(0);" class="list-group-item"><h4 class="list-group-item-heading">亲，没有新消息。</h4></a>');
              }
           });    
         } 
      });  
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
$(document).ready(Bell.init);

