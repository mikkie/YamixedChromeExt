Setting = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    SPACE : 'space',
    GROUP : 'group',
    SPACE_UL : 'spaceUl',
    GROUP_UL : 'groupUl',
    SPACE_AREA : 'spaceArea',
    GROUP_AREA : 'groupArea',
    SPACE_LI : 'spaceLi',
    GROUP_LI : 'groupLi',
    SPACE_DIV : 'spaceDiv',
    LOGOUT : 'logout',
    GROUP_DIV : 'groupDiv'
  };

  var ELS_CLASS = {
    NEW_SPACE : 'newSpace',
    NEW_GROUP : 'newGroup',
    USER_NAME : 'userName',
    CLOSE : 'close',
    EDIT_SPACE : 'editSpace',
    EDIT_GROUP : 'editGroup', 
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
      space : function(){
        $('#' + ELS_IDS.SPACE).click(function(){
           var $ul = $('#' + ELS_IDS.SPACE_UL);
           if($ul.is(':visible')){
              $('#' + ELS_IDS.GROUP_UL).show(500);
              $('#' + ELS_IDS.GROUP_AREA).show(500);
              $('#' + ELS_IDS.SPACE_AREA).hide(500);
              $ul.hide(500);
           }
           else{
              $('#' + ELS_IDS.GROUP_UL).hide(500);
              $('#' + ELS_IDS.GROUP_AREA).hide(500);
              $('#' + ELS_IDS.SPACE_AREA).show(500);
              $ul.show(500);
           }
        });
      },
      group : function(){
        $('#' + ELS_IDS.GROUP).click(function(){
           var $ul = $('#' + ELS_IDS.GROUP_UL);
           if($ul.is(':visible')){
              $('#' + ELS_IDS.SPACE_UL).show(500);
              $('#' + ELS_IDS.SPACE_AREA).show(500);
              $('#' + ELS_IDS.GROUP_AREA).hide(500);
              $ul.hide(500);
           }
           else{
              $('#' + ELS_IDS.SPACE_UL).hide(500);
              $('#' + ELS_IDS.SPACE_AREA).hide(500);
              $('#' + ELS_IDS.GROUP_AREA).show(500);
              $ul.show(500);
           }
        });
      },
      new_space : function(){
        $('.' + ELS_CLASS.NEW_SPACE).click(function(){
           showPage('content/newSpace.html','600px','600px'); 
        });
      },
      new_group : function(){
        $('.' + ELS_CLASS.NEW_GROUP).click(function(){
           showPage('content/newGroup.html','600px','600px'); 
        });
      },
      edit_space : function(){
         $(document).on('click','.' + ELS_CLASS.EDIT_SPACE,function(){
            var id = $(this).attr('id');
            showPage('content/newSpace.html?spaceId=' + id,'600px','600px');
         });
      },
      edit_group : function(){
         $(document).on('click','.' + ELS_CLASS.EDIT_GROUP,function(){
            var id = $(this).attr('id');
            showPage('content/newGroup.html?groupId=' + id,'600px','600px');
         });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      }
  };


  var renderPage = function(){
    renderSpace();
    renderGroup();
  };

  var renderSpace = function(){
    chrome.storage.sync.get('user',function(data){
       if(data.user){
         Service.getUserCreatedSpaces(data.user._id).done(function(data){
          var $li = $('#' + ELS_IDS.SPACE_LI);
          var $div = $('#' + ELS_IDS.SPACE_DIV);
          $li.empty();
          $div.find('.old').remove();
          if(data.success && data.success.length > 0){
            var html = '';
            var divHtml = '';
            for(var i in data.success){
              var space = data.success[i];
              var color = space.color;
              if(!color){
                color = Y_COMMON.util.randomColor('');   
              }
              html += '<a id="'+ space._id +'" href="javascript:void(0);" class="editSpace">' + space.spaceName + '</a>';
              divHtml += '<a id="'+ space._id  +'" href="javascript:void(0);" class="editSpace"><div class="thumbnail space old" style="background-color:#'+ color +';"><b>' + space.spaceName + '</b></div></a>';
            }
            $li.append(html);
            $div.prepend(divHtml);  
          }
         }); 
       }
    });
  };

  var renderGroup = function(){
    chrome.storage.sync.get('user',function(data){
       if(data.user){
         Service.getUserCreatedGroups(data.user._id).done(function(data){
          var $li = $('#' + ELS_IDS.GROUP_LI);
          var $div = $('#' + ELS_IDS.GROUP_DIV);
          $li.empty();
          $div.find('.old').remove();
          if(data.success && data.success.length > 0){
            var html = '';
            var divHtml = '';
            for(var i in data.success){
              var group = data.success[i];
              var color = group.color;
              if(!color){
                color = Y_COMMON.util.randomColor('');   
              }
              html += '<a id="'+ group._id +'" href="javascript:void(0);" class="editGroup">' + group.name + '</a>';
              divHtml += '<a id="'+ group._id  +'" href="javascript:void(0);" class="editGroup"><div class="thumbnail space old" style="background-color:#'+ color +';"><b>' + group.name + '</b></div></a>';
            }
            $li.append(html);
            $div.prepend(divHtml);  
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
     Y_COMMON.render.renderUser('.' + ELS_CLASS.USER_NAME);
     renderPage();
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Setting.init);