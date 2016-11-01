MAIN = (function() {

  var ELS_IDS = {
  	 MAIN_AREA : 'mainArea',
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
     BOOK_MARK : 'bookmark',
     CLOSE : 'closeWindow',
     BELL : 'bell',
     USER_NAME : 'userName',
     MAIN_AREA : 'mainarea',
     TAG_LIST : 'tagList',
     TAG : 'tag',
     LINK : 'link',
     DEL_TAG : 'delTag',
     EDIT_TAG : 'editTag',
     SIDE_BAR : 'sidebar',
     MAIN_AREA : 'mainarea',
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
      book_mark : function(){
         $(document).on('click','.' + ELS_CLASS.BOOK_MARK,function(){
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
      },
      selSpace_change : function(){
        $('#' + ELS_IDS.SEL_SPACE).change(function(){
          renderLinks();
        });
      },
      del_tag : function(){
        $('.' + ELS_CLASS.MAIN_AREA).on('click','.' + ELS_CLASS.DEL_TAG,function(){
           var $thumbnail = $(this).parents('.thumbnail');
           var linkId = $thumbnail.attr('linkId');
           Service.deleteLink(linkId).done(function(){
             $thumbnail.remove();
           });
        });
      },
      edit_tag : function(){
        $('.' + ELS_CLASS.MAIN_AREA).on('click','.' + ELS_CLASS.EDIT_TAG,function(){
          var $thumbnail = $(this).parents('.thumbnail');
          var linkId = $thumbnail.attr('linkId');
          Service.getLinkById(linkId).done(function(response){
            var data = response.success;
            data.images = [];
            data.images.push(data.previewImg);
            chrome.storage.sync.set({'newPageData' : data},function(){
               showPage("content/newBookmark.html",'600px','600px');
            });
          });
        });
      }
  };


  var parseCurrentPage = function(){
     chrome.runtime.sendMessage({action:'parsePage'},function(response){
        if(!response.url){
           alert('Sorry，this page can not be collected');
           return false;
        }
        var spaceId = $('#' + ELS_IDS.SEL_SPACE).val().split('-')[0];
        response.spaceId = spaceId;
        chrome.storage.sync.set({'newPageData' : response},function(){
          showPage("content/newBookmark.html",'600px','600px');
        });
     });
  };


  var renderHeader = function(user){
     return new Promise(function(resolve, reject){
     //1.render space selector
     chrome.storage.sync.get('userSpace',function(data){
        var options = '';
        if(data.userSpace && data.userSpace.success.length > 0){
           var spaces = data.userSpace.success;
           var id = Y_COMMON.getQueryString('spaceId');
           for(var i in spaces){
              var space = spaces[i];
              //if pass spaceId then select the id
              if(id){
               if(id == spaces[i]._id){
                 options = '<option name="selSpace" value="'+ spaces[i]._id +'-'+ spaces[i].userId + '">'+ spaces[i].spaceName +'</option>' + options;
               }
               else{
                 options += '<option name="selSpace" value="'+ spaces[i]._id +'-'+ spaces[i].userId + '">'+ spaces[i].spaceName +'</option>';
               }
              }
              //else select the default space id
              else{
               if(space.defaultSpace && space.userId == user._id){
                 options = '<option name="selSpace" value="'+ spaces[i]._id +'-'+ spaces[i].userId + '">'+ spaces[i].spaceName +'</option>' + options;
               }
               else{
                 options += '<option name="selSpace" value="'+ spaces[i]._id +'-'+ spaces[i].userId + '">'+ spaces[i].spaceName +'</option>';
               }
              }
           }
        }
        $('#' + ELS_IDS.SEL_SPACE).append(options);
        resolve();
     });
     renderBell(); 
     Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
     });
  };

  var renderBell = function(){
     Y_COMMON.service.getLogindUser(function(data){
        if(data.user){
          Service.getMessagesToUser(data.user._id).done(function(msg){
             if(msg.success && msg.success.length > 0){
                var $bellImg = $('.' + ELS_CLASS.BELL + ' img');
                var src = $bellImg.attr('src').replace('grey','pink');
                $bellImg.attr('src',src);
             }   
          });
        }  
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
            '<a class="link" href="'+link.url+'" target="_blank"><img src="'+link.previewImg+'" alt="..." ></a>', 
            '<div class="caption">', 
              '<h5><b>'+link.title+'</b></h5>', 
              '<p class="desc">', 
                link.description + '</p>', 
              '<p class="linkOP">', 
                '<a href="#" class="editTag btn btn-primary btn-xs" role="button">', 
                  '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>', 
                '</a>', 
                // '<a href="#" class="btn btn-success btn-xs" role="button" data-toggle="modal" data-target="#shareModal">', 
                //   '<span class="glyphicon glyphicon-share" aria-hidden="true">', 
                // '</a>', 
                '<a href="#" class="delTag btn btn-danger btn-xs" role="button">', 
                  '<span class="glyphicon glyphicon-trash" aria-hidden="true">', 
                '</a>',
              '</p>', 
            '</div>', 
          '</div>'].join('');
          }  
          $main.append(html);
          $main.find('img[src=""]').attr('src','chrome-extension://fjkkoeppfmigfbienchpdjcinogmccai/images/no_image.jpg');  
        }
        else{
          $main.append('<div style="text-align:center;"><button style="margin-top:25%;" type="button" class="bookmark btn btn-success btn-lg"><span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>收藏当前页面</button></div>');
        }
  }; 


  var showOrHideBookmarkBtn = function(isShow){
      if(isShow){
        $('.' + ELS_CLASS.BOOK_MARK).show();
        $('#' + ELS_IDS.SEL_SPACE).css('margin-left','1%');
      }
      else{
        $('.' + ELS_CLASS.BOOK_MARK).hide();
        $('#' + ELS_IDS.SEL_SPACE).css('margin-left','22%');
      }
  };

  var renderLinks = function(){
     var $space = $('#' + ELS_IDS.SEL_SPACE);
     var ids = $space.val().split('-');
     var spaceId = ids[0];
     var userId = ids[1];
     chrome.storage.sync.get('user',function(data){
       if(userId == data.user._id){
          showOrHideBookmarkBtn(true);
       }
       else{
          Service.checkRWPermission(spaceId,data.user._id).done(function(data){
             if(data.success == 'rw'){
                showOrHideBookmarkBtn(true);
             }
             else{
                showOrHideBookmarkBtn(false);
             } 
          });
       }
     });
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
       $('.' + ELS_CLASS.SIDE_BAR).show();
       $('.' + ELS_CLASS.MAIN_AREA).addClass('col-sm-9').removeClass('col-sm-12');
       var html = '<li class="active"><a href="#" class="tag">'+ tags[0] +'<span class="sr-only"></span></a></li>' 
       if(tags.length > 1){
         for(var i = 1; i < tags.length; i++){
           html += '<li><a href="#" class="tag">'+ tags[i] +'</a></li>'  
         }  
       }
       $list.append(html);
    }
    else{
       $('.' + ELS_CLASS.SIDE_BAR).hide();
       $('.' + ELS_CLASS.MAIN_AREA).addClass('col-sm-12').removeClass('col-sm-9');
    }
  };

  var renderPage = function(user){
     renderHeader(user).then(function(){
       renderLinks();
     });
  };


  var searchLinks = function(keyword,tag){
     var spaceId = $('#' + ELS_IDS.SEL_SPACE).val().split('-')[0];
     Service.searchLinks(spaceId,keyword,tag).done(function(data){
        showLinks(data);
        if(data.success && data.success.length == 0){
          var url = $.trim(keyword);
          if(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/.test(url)){
            if(url.indexOf('http') != 0){
               var proto = ['http','https'];
               for(var i in proto){
                 var ok = false;
                 Y_COMMON.util.urlExists(proto[i] + '://' + url,false,function(res){
                   if(res){
                     window.open(proto[i] + '://' + url); 
                     ok = true;
                   }   
                 });
                 if(ok){
                   break;
                 }
               } 
            }
            else{
               window.open(url);
            }
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
     chrome.storage.sync.get('user',function(data){
        renderPage(data.user);
     });
     
  };
  
  return {
  	init : init
  };

})();
$(document).ready(MAIN.init);