Space = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    GROUP_INPUT : 'groupInput',
    GROUP_TIPS : 'groupTips',
    LOGOUT : 'logout',
    CURRENT_GROUP : 'currentGroup',
    SPACE_NAME : 'spaceName',
    CREATE_SPACE : 'createSpace'
  };	

  var ELS_CLASS = {
     CLOSE : 'close',
     USER_NAME : 'userName',
     DEL_GROUP : 'delGroup' 
  };


  var isGroupExists = function(id){
     var found = false;
     $('#' + ELS_IDS.CURRENT_GROUP + ' tr').each(function(){
        var $this = $(this);
        if($this.attr('value') == id){
           found = true;
           return false;
        }
     });
     return found;
  };

  var buildGroupSelectTips = function(name){
     Service.findGroupByNameLike(name).done(function(data){
       var html = '';
       var $tips = $('#' + ELS_IDS.GROUP_TIPS);
       $tips.empty();
       if(data.success && data.success.length > 0){
         for(var i in data.success){
           var group = data.success[i];
           if(!isGroupExists(group._id)){
             html += '<li value="'+ group._id +'">' + group.name + '</li>';
           }
         }
         $tips.append(html); 
       }
     });
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
            chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/setting.html"), width : '900px',height : '600px'});
        });
      },
      logout : function(){
         $('#' + ELS_IDS.LOGOUT).click(function(){
            showPage("content/login.html",'400px','300px');
         });
      },
      new_group : function(){
        $('#' + ELS_IDS.GROUP_INPUT).keyup(function(){
          var value = $(this).val();
          if(value.length > 3){
             buildGroupSelectTips(value);
          }
          else{
            $('#' + ELS_IDS.GROUP_TIPS).empty();
          }
        });
      },
      group_tip_click : function(){
        $('#' + ELS_IDS.GROUP_TIPS).on('click','li',function(){
          var $this = $(this);
          var temp = ['<tr value="'+ $this.attr('value') +'">',
                      '<th style="text-align:left;">'+ $this.text() +'</th>',
                      '<th style="text-align:center;">',
                      '<div class="checkbox">',
                      '<label>',
                      '<input type="checkbox" value="">写',
                      '</label>',
                      '</div>', 
                      '</th>',
                      '<th style="text-align:right;">',   
                      '<button type="button" class="btn btn-danger btn-sm delGroup">',
                      '<span class="glyphicon glyphicon-trash" aria-hidden="true">',
                      '</button>',
                      '</th>',
                      '</tr>'
          ].join('');
          $('#' + ELS_IDS.CURRENT_GROUP).prepend(temp);
          $this.remove();
        });
      },
      del_group : function(){
        $('#' + ELS_IDS.CURRENT_GROUP).on('click','.' + ELS_CLASS.DEL_GROUP,function(){
          $(this).parents('tr').remove();
        });
      },
      createSpace : function(){
        $('#' + ELS_IDS.CREATE_SPACE).click(function(){
           var $sName = $('#' + ELS_IDS.SPACE_NAME);
           var name = $sName.val();
           if(!name){
             $sName.focus();
             return;
           }
           Service.findSpaceByName(name).done(function(data){
             if(data.error || data.success){
                $sName.focus();
                return;
             }
             chrome.storage.sync.get('user',function(data){
              if(data.user){
               var groups = [];
               $('#' + ELS_IDS.CURRENT_GROUP + ' tr').each(function(){
                  var $tr = $(this);
                  var groupId = $tr.attr('value');
                  if(groupId){
                    var name = $($tr.children()[0]).text();
                    var permission = $($tr.children()[1]).find('input').is(':checked') ? 'rw' : 'r';
                    groups.push(groupId + '-' + name + '-' + permission); 
                  }
               });
               Service.createNewSpace(name,groups,data.user._id).done(function(){
                  chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/setting.html"), width : '900px',height : '600px'});
               });
              }  
             });

           });   
        });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
     Y_COMMON.render.renderUser('.' + ELS_CLASS.USER_NAME);
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Space.init);