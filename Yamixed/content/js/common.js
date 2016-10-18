Y_COMMON = {
  config : {
    server : {
  	   host : 'https://localhost:3000'
    }
  },
  form : {
  	 validate : function($input) {
  	 	var remoteSrc = $input.attr('remote');
  	 	if(!remoteSrc){
         return false; 
      }
      var val = $input.val();
  	 	if(!val){
          return false; 
  	 	}
  	  $.get(Y_COMMON.config.server.host + remoteSrc + val,function(data){
        if(data.error){
          $input[0].setCustomValidity(data.error);
        }
        else{
         	$input[0].setCustomValidity('');
        }
      });
  	 }
  },
  init : function(){
     $('input[remoteValidte]').on('keyup blur',function(){
     	 Y_COMMON.form.validate($(this));
     });
  },
  render : {
    renderUser : function(avatarSel,selector){
      chrome.storage.sync.get('user',function(data){
       if(data.user){
          $(avatarSel).css('background','#' + data.user.avatar.color).text(data.user.avatar.alphabet);
          $(selector).html('<span userId="'+ data.user._id + '" class="caret"></span>&nbsp;' + data.user.userName); 
       }  
      });
    }
  },
  getQueryString : function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  },
  util : {
    randomColor : function(color){    
      return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
      && (color.length == 6) ?  color : arguments.callee(color);    
    }
  },
  service : {
    getLogindUser : function(callback){
      chrome.storage.sync.get('user',function(data){
         callback(data); 
      });
    }
  }
};

$(document).ready(Y_COMMON.init);

