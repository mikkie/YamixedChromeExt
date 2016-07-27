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

   
   return {
      ajax : ajax
   };

})(jQuery);