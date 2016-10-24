Bookmark = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    GO_SETTING : 'goSetting',
    TITLE : 'title',
    DESC : 'desc',
    IMAGE_HOLDER : 'imageHolder',
    CURRENT_SPACE : 'dropdownMenu1',
    SPACES : 'spaces',
    NEW_TAG : 'newTag',
    TAGS : 'tags',
    IMG_URL : 'imageUrl',
    IMG_LINK : 'imglink',
    LINK_IMG : 'linkimg',
    SAVE_MIX_FORM : 'saveMixForm',
    CHK_IMG_LINK : 'chkimglink',
    IMG_LINK_DIV : 'imglinkDiv',
    SAVE_MIX : 'saveMix',
    URL : 'url',
    ID : '_id'
  };	

  var ELS_CLASS = {
     CLOSE : 'close',
     USER_NAME : 'userName',
     TAG : 'tag',
     PREVIEW_IMG : 'previewImg',
     AVATAR : 'avatar'  
  };


  var showPage = function(page,width,height){
     chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL(page), width : width,height : height});
  };
 
  
  var createNewTag = function(input){
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
      go_setting : function(){
         $('#' + ELS_IDS.GO_SETTING).click(function(){
            showPage("content/setting.html",'900px','600px');
         });
      },
      new_tag : function(){
         $('#' + ELS_IDS.NEW_TAG).keyup(function(e){
             if(e.which == 13){
                createNewTag(this);
             }
         }).focusout(function(){
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
      },
      image_click : function(){
        $('#' + ELS_IDS.SAVE_MIX_FORM).on('click','.' + ELS_CLASS.PREVIEW_IMG,function(){
           var $this = $(this); 
           var src = $this.attr('src');
           $('#' + ELS_IDS.IMG_URL).val(src);
           $('#' + ELS_IDS.SAVE_MIX_FORM + ' .' + ELS_CLASS.PREVIEW_IMG).css('border','1px solid #ddd');
           $this.css('border','2px solid #FF8F00');
        });
      },
      chk_imagelink_click : function(){
         $('#' + ELS_IDS.CHK_IMG_LINK).click(function(){
            if($(this).is(':checked')){
              var $imglink = $('#' + ELS_IDS.IMG_LINK);
              $imglink.removeAttr('readonly');
              if($imglink.val()){
                $('#' + ELS_IDS.LINK_IMG).trigger('click');
                $('#' + ELS_IDS.IMG_LINK_DIV).show();
              } 
            }
            else{
              var $imglink = $('#' + ELS_IDS.IMG_LINK);
              $imglink.attr('readonly','readonly');
              $('#' + ELS_IDS.IMG_LINK_DIV).hide();
              $('.' + ELS_CLASS.PREVIEW_IMG +':first').trigger('click');
            }
         });
      },
      image_link_focusout : function(){
        $('#' + ELS_IDS.IMG_LINK).focusout(function(){
          var imglink = $(this).val();
          if(imglink){
            var $linkimg = $('#' + ELS_IDS.LINK_IMG);
            $linkimg.attr('src',imglink);
            $linkimg.trigger('click');
            $('#' + ELS_IDS.IMG_LINK_DIV).show();
          }
        });
      }, 
      saveMix : function(){
        $('#' + ELS_IDS.SAVE_MIX).click(function(){
           var tags = [];
           $('#' + ELS_IDS.TAGS + ' button').each(function(){
              tags.push($(this).text());
           });
           var spaceId = $('#' + ELS_IDS.CURRENT_SPACE).attr('spaceId');
           Service.postNewLink({
              _id : $('#' + ELS_IDS.ID).val(),
              url : $('#' + ELS_IDS.URL).val(),
              title : $.trim($('#' + ELS_IDS.TITLE).val()),
              description : $.trim($('#' + ELS_IDS.DESC).val()),
              previewImg : $('#' + ELS_IDS.IMG_URL).val(),
              spaceId : spaceId,
              tags : tags
           }).done(function(){
              showPage("content/content.html?spaceId=" + spaceId,'900px','600px');
           });
        });
      },
      sel_space_click : function(){
        $('#' + ELS_IDS.SPACES).on('click','a',function(){
          var $this = $(this);
          var text = $this.text();
          var id = $this.attr('id');
          $('#' + ELS_IDS.CURRENT_SPACE).html(text + '<span class="caret"></span>').attr('spaceId',id);
        });
      }
  };

  var renderHeader = function(imageData){
    //1
    chrome.storage.sync.get('userSpace',function(data){
        var $spaces = $('#' + ELS_IDS.SPACES);
        $spaces.empty();
        var options = '';
        if(data.userSpace && data.userSpace.success.length > 0){
           var spaces = data.userSpace.success;
           var options = '';
           for(var i in spaces){
              var space = spaces[i];
              if((imageData.spaceId && imageData.spaceId == space._id) || (!imageData.spaceId && i == 0)){
                var $currentSpace = $('#' + ELS_IDS.CURRENT_SPACE);
                $currentSpace.attr('spaceId',spaces[i]._id);
                $currentSpace.html(spaces[i].spaceName + '<span class="caret"></span>'); 
              }
              options += '<li><a href="#" id="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</a></li>';
           }
           $spaces.append(options);
        }
     });
     //2
     Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
  };

  var renderImages = function(data){
     var images = data.images;
     renderHeader(data);
     var $holder = $('#' + ELS_IDS.IMAGE_HOLDER);
     $holder.empty();
     var html = '';
     if(images.length > 0){
       for(var i in images){
          html += '<a href="javascript:void(0);"><img src="' + images[i]+'" alt="..." class="img-thumbnail previewImg"></a>';   
       }
     }
     if(html){
       $holder.append(html); 
       $('.' + ELS_CLASS.PREVIEW_IMG +':first').trigger('click');
     }
  };

  var renderPage = function(){
     chrome.storage.sync.get('newPageData',function(data){
       if(data.newPageData){
          var newPageData = data.newPageData;
          $('#' + ELS_IDS.URL).val(newPageData.url);
          $('#' + ELS_IDS.TITLE).val(newPageData.title);
          $('#' + ELS_IDS.DESC).val(newPageData.description);
          renderImages(newPageData);
          if(newPageData.tags && newPageData.tags.length > 0){
            for(var i in newPageData.tags){
              $('#' + ELS_IDS.TAGS).prepend('<button type="button" class="tag btn btn-warning btn-sm" style="margin-left:10px;">'+ newPageData.tags[i] +'</button>');
            }
          }
          if(newPageData._id){
            $('#' + ELS_IDS.ID).val(newPageData._id);
          }   
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
$(document).ready(Bookmark.init);