Note = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    LOGOUT : 'logout',
    EDITOR : 'editor',
    SAVE : 'saveNote',
    SEL_SPACE : 'selSpace',
    NEW_TAG : 'newTag',
    TAGS : 'tags',
    DEL : 'delNote'
  };

  var ELS_CLASS = {
    USER_NAME : 'userName',
    CLOSE : 'close',
    AVATAR : 'avatar',
    TAG_TIPS : 'tagTips',
    TAG_TIP_LI : 'tagTipLi',
    TAG : 'tag'
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
           var tags = [];
           $('#' + ELS_IDS.TAGS + ' button').each(function(){
              tags.push($(this).text());
           });
           var content = $('#' + ELS_IDS.EDITOR).val();
           chrome.storage.sync.get("yamixedNote",function(data){
              var id = data.yamixedNote._id;
              var sentence = data.yamixedNote.sentence;
              var url = data.yamixedNote.url;
              var x = data.yamixedNote.x;
              var y = data.yamixedNote.y;
              var space = $('#' + ELS_IDS.SEL_SPACE).val();
              Y_COMMON.service.getLogindUser(function(data){
                 Service.saveNote(id,space,content,sentence,url,x,y,data.user._id,tags).done(function(data){
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
      },
      tag_tip_click : function(){
         $('#' + ELS_IDS.TAGS).on('mousedown','.' + ELS_CLASS.TAG_TIP_LI,function(){
            var $this = $(this);
            var tag = $this.text();
            var $input = $this.parents('ul').prev();
            $input.val(tag).trigger('focusout');
         });
      },
      new_tag : function(){
         $('#' + ELS_IDS.NEW_TAG).keyup(function(e){
             if(e.which == 13){
                createNewTag(this);
             }
             else{
                autoCompleteTag($(this));
             }
         }).focusout(function(e){
             createNewTag(this);
         });
      },
      tags_click : function(){
        $('#' + ELS_IDS.TAGS).on('click','.' + ELS_CLASS.TAG,function(){
          $(this).remove();
          $('#' + ELS_IDS.NEW_TAG).show();
        }).on('mouseover','.' + ELS_CLASS.TAG, function(){
           $(this).addClass('btn-danger').removeClass('btn-warning');
        }).on('mouseout','.' + ELS_CLASS.TAG,function(){
           $(this).addClass('btn-warning').removeClass('btn-danger'); 
        });
      }
  };

  var createNewTag = function(input){
    $('.' + ELS_CLASS.TAG_TIPS).remove();
    var $this = $(input);
    var val = $.trim($this.val());
    if(val){
      var found = false;
      $('#' + ELS_IDS.TAGS + ' button').each(function(){
        if($(this).text() == val){
          found = true;
          return false;
        }
      });
      if(found){
        return false;
      }
      $('#' + ELS_IDS.TAGS).prepend('<button type="button" class="tag btn btn-warning btn-sm" style="margin-left:10px;">'+ val +'</button>');
      $this.val('');
      if($('#' + ELS_IDS.TAGS).find('button').length >= 3){
        $this.hide();
      }
    }
  };

  var autoCompleteTag = function($input){
     var spaceId = $('#' + ELS_IDS.SEL_SPACE).val();
     $('.' + ELS_CLASS.TAG_TIPS).remove();
     var val = $input.val();
     if(val){
       chrome.storage.sync.get("tags" + spaceId,function(data){
          if(data && data["tags" + spaceId] && data["tags" + spaceId].length > 0){
             var lis = '';
             for(var i in data["tags" + spaceId]){
               var tag = data["tags" + spaceId][i];
               if(new RegExp('^' + val,'ig').test(tag)){
                 lis += '<li><a class="tagTipLi" href="#">'+ tag +'</a></li>'
               }
             }
             if(lis){
                var left = $input.offset().left + 'px';
                $input.after('<ul class="tagTips dropdown-menu" style="top:33px;display:block;left:'+ left +'">' + lis + '</ul>');
             } 
          }
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

  var renderTags = function(linkId){
     Service.getLinkById(linkId).done(function(data){
        if(data.success){
          var tags = data.success.tags;
          if(tags && tags.length > 0){
            for(var i in tags){
              $('#' + ELS_IDS.TAGS).prepend('<button type="button" class="tag btn btn-warning btn-sm" style="margin-left:10px;">'+ tags[i] +'</button>');
              if(tags.length >= 3){
                $('#' + ELS_IDS.NEW_TAG).hide();
              }
            }
          }
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
         if(data.yamixedNote.link){
           renderTags(data.yamixedNote.link); 
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