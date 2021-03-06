Space = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    NEW_USER_INPUT : 'newUserInput',
    USER_TIPS : 'userTips',
    LOGOUT : 'logout',
    CURRENT_USER : 'currentUsers',
    CREATE_GROUP : 'createGroup',
    DELETE_GROUP : 'deleteGroup',
    GROUP_NAME : 'groupName'
  };

  var ELS_CLASS = {
     CLOSE : 'close',
     USER_NAME : 'userName',
     DEL_USER : 'delUser',
     AVATAR : 'avatar'
  };



  var isUserExists = function(userId){
     var found = false;
     $('#' + ELS_IDS.CURRENT_USER + ' tr').each(function(){
        var $this = $(this);
        if($this.attr('value') == userId){
           found = true;
           return false;
        }
     });
     return found;
  };

  var buildUserSelectTips = function(value){
    Service.getUserByNameOrEmail(value).done(function(data){
       var html = '';
       var $tips = $('#' + ELS_IDS.USER_TIPS);
       $tips.empty();
       if(data.success && data.success.length > 0){
         Y_COMMON.service.getLogindUser(function(loginUser){
           for(var i in data.success){
             var user = data.success[i];
             if(!isUserExists(user._id) && user._id != loginUser.user._id){
               html += '<li value="'+ user._id +'">' + user.userName + '   <span style="color:grey">' + user.email + '</span></li>';
             }
           }
           $tips.append(html); 
         });
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
      newUser : function(){
        $('#' + ELS_IDS.NEW_USER_INPUT).keyup(function(){
          var value = $(this).val();
          if(value.length > 3){
             buildUserSelectTips(value);
          }
          else{
            $('#' + ELS_IDS.USER_TIPS).empty();
          }
        });
      },
      user_tip_click : function(){
        $('#' + ELS_IDS.USER_TIPS).on('click','li',function(){
          var $this = $(this);
          var temp = ['<tr value="'+ $this.attr('value') +'">',
                      '<th style="text-align:left;">'+ $this.text() +'</th>',
                      '<th style="text-align:right;">',   
                      '<button type="button" class="btn btn-danger btn-sm delUser">',
                      '<span class="glyphicon glyphicon-trash" aria-hidden="true">',
                      '</button>',
                      '</th>',
                      '</tr>'
          ].join('');
          $('#' + ELS_IDS.CURRENT_USER).prepend(temp);
          $this.remove();
        });
      },
      del_user : function(){
        $('#' + ELS_IDS.CURRENT_USER).on('click','.' + ELS_CLASS.DEL_USER,function(){
          $(this).parents('tr').remove();
        });
      },
      deleteGroup : function(){
        $('#' + ELS_IDS.DELETE_GROUP).click(function(){
          if(confirm('confirm to delete this group?')){
             var groupId = Y_COMMON.getQueryString('groupId')
             Service.disableGroup(groupId).done(function(){
               chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/setting.html"), width : '900px',height : '600px'});
             });
           }
        });
      },
      createGroup : function(){
        $('#' + ELS_IDS.CREATE_GROUP).click(function(){
           var $gName = $('#' + ELS_IDS.GROUP_NAME);
           var name = $gName.val();
           if(!name || name.indexOf('-') >=0){
             $gName.focus();
             return;
           }
           Service.findGroupByName(name).done(function(data){
             var id = Y_COMMON.getQueryString('groupId');
             if(!id){
               if(data.error || data.success){
                 $gName.focus();
                 return;
               }
             }
             chrome.storage.sync.get('user',function(data){
              if(data.user){
               var users = [];
               $('#' + ELS_IDS.CURRENT_USER + ' tr').each(function(){
                  var $tr = $(this);
                  var userId = $tr.attr('value');
                  if(userId){
                    var nameAndEmail = $($tr.children()[0]).text();
                    users.push(userId + '-' + nameAndEmail); 
                  }
               });
               Service.createNewGroup(id,name,Y_COMMON.util.randomColor(''),users,data.user._id).done(function(){
                  chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL("content/setting.html"), width : '900px',height : '600px'});
               });
              }  
             });

           });  
        });
      }
  };


  var renderEditGroup = function(id){
    $('#' + ELS_IDS.CREATE_GROUP).text('update');
    Service.findGroupById(id).done(function(data){
      if(data.success){
        var group = data.success;
        $('#' + ELS_IDS.GROUP_NAME).attr('readonly','readonly').val(group.name);
        if(group.users && group.users.length > 0){
           var html = '';
           for(var i in group.users){
              var user = group.users[i];
              var temp = ['<tr value="'+ user.userId +'">',
                      '<th style="text-align:left;">'+ user.userName +'</th>',
                      '<th style="text-align:right;">',   
                      '<button type="button" class="btn btn-danger btn-sm delUser">',
                      '<span class="glyphicon glyphicon-trash" aria-hidden="true">',
                      '</button>',
                      '</th>',
                      '</tr>'
              ].join('');
              html += temp;
           }
           $('#' + ELS_IDS.CURRENT_USER).prepend(html);   
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
     var id = Y_COMMON.getQueryString('groupId');
     if(id){
        renderEditGroup(id);
        $('#' + ELS_IDS.DELETE_GROUP).show();
     }
     Y_COMMON.render.renderUser('.' + ELS_CLASS.AVATAR,'.' + ELS_CLASS.USER_NAME);
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Space.init);