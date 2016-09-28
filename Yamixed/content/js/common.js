Y_COMMON = {
  config : {
    server : {
  	   host : 'http://localhost:3000'
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
    renderUser : function(selector){
      chrome.storage.sync.get('user',function(data){
       if(data.user){
          $(selector).html('<span class="caret"></span>&nbsp;' + data.user.userName); 
       }  
      });
    }
  }
};

$(document).ready(Y_COMMON.init);

