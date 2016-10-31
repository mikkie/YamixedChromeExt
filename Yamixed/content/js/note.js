Note = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    LOGOUT : 'logout',
    EDITOR : 'editor',
    SAVE : 'saveNote',
    SEL_SPACE : 'selSpace',
    DEL : 'delNote'
  };

  var ELS_CLASS = {
    USER_NAME : 'userName',
    CLOSE : 'close',
    AVATAR : 'avatar'
  };


  var showPage = function(url,width,height){
    chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL(url), width : width,height : height}); 
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
      save : function(){
        $('#' + ELS_IDS.SAVE).click(function(){
           var content = $('#' + ELS_IDS.EDITOR).val();
           chrome.storage.sync.get("yamixedNote",function(data){
              var id = data.yamixedNote._id;
              var sentence = data.yamixedNote.sentence;
              var url = data.yamixedNote.url;
              var x = data.yamixedNote.x;
              var y = data.yamixedNote.y;
              var space = $('#' + ELS_IDS.SEL_SPACE).val();
              Y_COMMON.service.getLogindUser(function(data){
                 Service.saveNote(id,space,content,sentence,url,x,y,data.user._id).done(function(data){
                    chrome.runtime.sendMessage({action:'close'});
                    if(data.success){
                      chrome.runtime.sendMessage({action:'highlight',note:data.success});
                    }
                 });
              });
           });
        });
      },
      del : function(){
        $('#' + ELS_IDS.DEL).click(function(){
           chrome.storage.sync.get("yamixedNote",function(data){
              var id = data.yamixedNote._id;
              var url = data.yamixedNote.url;
              Y_COMMON.service.getLogindUser(function(data){
                Service.delNote(id,url,data.user._id).done(function(data){
                    chrome.runtime.sendMessage({action:'close'});
                    if(data.success){
                      chrome.runtime.sendMessage({action:'lowlight',note:data.success});
                    }
                });
              });
           });
        });
      }
  };


  var renderSpace = function(renderNote){
    Y_COMMON.service.getLogindUser(function(data){
      if(data.user){
        Service.getUserCreatedSpaces(data.user._id).done(function(data){
          if(data.success && data.success.length > 0){
            for(var i in data.success){
              var space = data.success[i];
              if(space.defaultSpace){
                 $('#' + ELS_IDS.SEL_SPACE).prepend('<option value="'+space._id+'">'+ space.spaceName +'</option>');
              }
              else{
                 $('#' + ELS_IDS.SEL_SPACE).append('<option value="'+space._id+'">'+ space.spaceName +'</option>');
              }
            }
            renderNote();
          } 
        });
      }
    });
  };


  var renderNote = function(){
    chrome.storage.sync.get("yamixedNote",function(data){
       var content = data.yamixedNote.sentence;
       if(data.yamixedNote.content){
         content = data.yamixedNote.content;
         $('#' + ELS_IDS.DEL).show(); 
       }
       $('#' + ELS_IDS.EDITOR).text(content);
       if(data.yamixedNote._id){
         var $space = $('#' + ELS_IDS.SEL_SPACE);
         if(data.yamixedNote.space){
           $space.val(data.yamixedNote.space);
         }  
         $space.attr('disabled','disabled');
       }
    });
  };

  var renderPage = function(){
    renderSpace(renderNote);
  };


  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
     renderPage();
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Note.init);