COMMON = (function($){

   var ajax = function(option){
      var optionDefault = {
      	 url : '',
      	 beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + Base64.encode(CONFIG.basicAuth.username + ":" + CONFIG.basicAuth.password));
         },
         contentType : 'application/json',
         data : {time : Math.random()},
         type : 'post',
         async : true,
  		 dataType : 'json',
  		 callback : function(data){}
      };
      var mergeOption = $.extend({},optionDefault,option);
      $.ajax(mergeOption).done(mergeOption.callback); 
   };


   var logError = function(error){
   	   var msg = error + ',请联系 ' + CONFIG.SUPPORT;
       console.error(msg);
       chrome.notifications.create('error-' + new Date().getTime(), {
          type : 'basic',
          iconUrl : '../../images/logo_64x64.png',
          title : 'Error',
          message : msg
       }, function(notificationId){
       });
   }; 
   
   return {
      ajax : ajax,
      logError : logError
   };

})(jQuery);