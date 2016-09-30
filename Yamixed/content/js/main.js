MAIN = (function() {

  var ELS_IDS = {
  	 MAIN_AREA : 'mainArea',
     BOOK_MARK : 'bookmark',
     GO_SETTING : 'goSetting',
     HOT_KEYS : 'hotkeys',
     ACCOUNT : 'account',
     LOGOUT : 'logout',
     SEL_SPACE : 'selSpace',
     LINK_TEMP : 'linkTemp',
     SEARCH_LINKS : 'searchLinks',
     SEL_TAG : 'selTag',
     SEARCH_TAG : 'searchTag' 
  };	

  var ELS_CLASS = {
     CLOSE : 'close',
     BELL : 'bell',
     USER_NAME : 'userName',
     MAIN_AREA : 'mainarea',
     TAG_LIST : 'tagList',
     TAG : 'tag',
     LINK : 'link' 
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
      book_mark : function(){
         $('#' + ELS_IDS.BOOK_MARK).click(function(){
            parseCurrentPage();
         });
      },
      go_setting : function(){
         $('#' + ELS_IDS.GO_SETTING).click(function(){
            showPage("content/setting.html",'900px','600px');
         });
      },
      bell : function(){
         $('.' + ELS_CLASS.BELL).click(function(){
            showPage("content/bell.html",'600px','600px');   
         });
      },
      hotkeys : function(){
         $('#' + ELS_IDS.HOT_KEYS).click(function(){
            showPage("content/hotkeys.html",'600px','600px');
         });
      },
      account : function(){
         $('#' + ELS_IDS.ACCOUNT).click(function(){
            showPage("content/account.html",'500px','600px');
         });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      },
      searchLinksClick : function(){
         $('#' + ELS_IDS.SEARCH_LINKS).keyup(function(e){
            var keyword = $.trim($(this).val());
            if(!keyword){
              renderLinks();
              return;
            }
            if(e.which == 13){
               var tag = $('#' + ELS_IDS.SEL_TAG).text();
               if(tag == '@'){
                  tag = null;
               }
               else{
                  tag = tag.replace('@','');
               }
               searchLinks(keyword,tag);
            } 
         });
      },
      tag_click : function(){
        $('.' + ELS_CLASS.TAG_LIST).on('click','.' + ELS_CLASS.TAG,function(){
            var tag = $.trim($(this).text());
            $('#' + ELS_IDS.SEL_TAG).text('@' + tag);
            searchLinks(null,tag);  
        });
      },
      seltag_click : function(){
         $('#' + ELS_IDS.SEL_TAG).click(function(){
            $(this).text('@');
            renderLinks();
         }).mouseover(function(){
            var $this = $(this);
            var tag = $this.text();
            if(tag != '@'){
               $(this).css('background-color','#ea5f5f');
            }
         }).mouseout(function(){
            $(this).css('background-color','#eee');
         });
      },
      searchTag : function(){
        $('#' + ELS_IDS.SEARCH_TAG).keyup(function(){
          var $tags = $('.' + ELS_CLASS.TAG);
          if($tags.length == 0){
             return;   
          }
          var tag = $.trim($(this).val());
          $tags.each(function(){
            var $this = $(this);
            if(tag){
               if(!new RegExp(tag,'ig').test($this.text())){
                  $this.hide();
               }
            }
            else{
              $this.show();
            }
          });
        }); 
      },
      link_click : function(){
        $('.' + ELS_CLASS.MAIN_AREA).on('click','.' + ELS_CLASS.LINK,function(){
            var linkId = $(this).parent().attr('linkId');
            Service.updateLinkVisitTime(linkId);
        });
      }
  };


  var parseCurrentPage = function(){
     chrome.runtime.sendMessage({action:'parsePage'},function(response){
        chrome.storage.sync.set({'newPageData' : response});
        showPage("content/newBookmark.html",'600px','600px');
     });
  };


  var renderHeader = function(){
     return new Promise(function(resolve, reject){
     //1.render space selector
     chrome.storage.sync.get('userSpace',function(data){
        var options = '';
        if(data.userSpace && data.userSpace.success.length > 0){
           var spaces = data.userSpace.success;
           for(var i in spaces){
              var space = spaces[i];
              if(space.defaultSpace){
                 options = '<option name="selSpace" value="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</option>' + options;
              }
              else{
                 options += '<option name="selSpace" value="'+ spaces[i]._id +'">'+ spaces[i].spaceName +'</option>';
              }
           }
        }
        $('#' + ELS_IDS.SEL_SPACE).append(options);
        resolve();
     });
     Y_COMMON.render.renderUser('.' + ELS_CLASS.USER_NAME);
     });
  };


  var showLinks = function(data){
     var $main = $('.' + ELS_CLASS.MAIN_AREA);
        $main.empty();
        if(data.success && data.success.length > 0){
          var html = '';
          for(var i in data.success){
              var link = data.success[i];
              html += ['<div class="thumbnail" linkId="'+ link._id +'">', 
            '<a class="link" href="'+link.url+'" target="_blank"><img src="'+link.previewImg+'" alt="..."></a>', 
            '<div class="caption">', 
              '<h5><b>'+link.title+'</b></h5>', 
              '<p class="desc">', 
                link.description + '</p>', 
              '<p>', 
                '<a href="#" class="btn btn-primary btn-xs" role="button">', 
                  '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>', 
                '</a>', 
                '<a href="#" class="btn btn-success btn-xs" role="button">', 
                  '<span class="glyphicon glyphicon-share" aria-hidden="true">', 
                '</a>', 
                '<a href="#" class="btn btn-danger btn-xs" role="button">', 
                  '<span class="glyphicon glyphicon-trash" aria-hidden="true">', 
                '</a>',
              '</p>', 
            '</div>', 
          '</div>'].join('');
          }  
          $main.append(html);  
        }
  }; 

  var renderLinks = function(){
     var spaceId = $('#' + ELS_IDS.SEL_SPACE).val();
     Service.getLinksBySpace(spaceId).done(function(data){
        showLinks(data);
        renderTags(data);
     });
  };


  var addTag = function(allTags,tags){
     if(allTags.length == 0){
        for(var i in tags){
          allTags.push(tags[i]); 
        }
        return;
     }
     for(var i in tags){
        var tag = tags[i];
        var found = false;
        for(var j in allTags){
           var allTag = allTags[j];  
           if(allTag == tag){
              found = true;
              break; 
           }  
        }
        if(!found){
           allTags.push(tag);
        }  
     }  
  };

  var renderTags = function(data){
    var $list = $('.' + ELS_CLASS.TAG_LIST);
    $list.empty();
    var tags = [];
    if(data.success && data.success.length > 0){
       for(var i in data.success){
          var link = data.success[i]; 
          if(link.tags && link.tags.length > 0){
             addTag(tags,link.tags);   
          } 
       }
    }
    if(tags.length > 0){
       var html = '<li class="active"><a href="javascript:void(0);" class="tag">'+ tags[0] +'<span class="sr-only"></span></a></li>' 
       if(tags.length > 1){
         for(var i = 1; i < tags.length; i++){
           html += '<li><a href="javascript:void(0);" class="tag">'+ tags[i] +'</a></li>'  
         }  
       }
       $list.append(html);
    }
  };

  var renderPage = function(){
     renderHeader().then(function(){
       renderLinks();
     });
  };


  var searchLinks = function(keyword,tag){
     var spaceId = $('#' + ELS_IDS.SEL_SPACE).val();
     Service.searchLinks(spaceId,keyword,tag).done(function(data){
        showLinks(data);
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
$(document).ready(MAIN.init);