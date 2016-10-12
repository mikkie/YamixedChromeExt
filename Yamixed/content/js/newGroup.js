Space = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    NEW_USER_INPUT : 'newUserInput',
    USER_TIPS : 'userTips',
    LOGOUT : 'logout',
    CURRENT_USER : 'currentUsers',
    CREATE_GROUP : 'createGroup',
    GROUP_NAME : 'groupName'
  };

  var ELS_CLASS = {
     CLOSE : 'close',
     USER_NAME : 'userName',
     DEL_USER : 'delUser'
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
         for(var i in data.success){
           var user = data.success[i];
           if(!isUserExists(user._id)){
             html += '<li value="'+ user._id +'">' + user.userName + '   <span style="color:grey">' + user.email + '</span></li>';
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
      createGroup : function(){
        $('#' + ELS_IDS.CREATE_GROUP).click(function(){
           var $gName = $('#' + ELS_IDS.GROUP_NAME);
           var name = $gName.val();
           if(!name){
             $gName.focus();
             return;
           }
           Service.findGroupByName(name).done(function(data){
             if(data.error || data.success){
                $gName.focus();
                return;
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
               Service.createNewGroup(name,users,data.user._id).done(function(){
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