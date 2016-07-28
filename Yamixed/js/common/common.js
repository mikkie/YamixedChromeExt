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


  var absolute = function(url){
    var base = window.location.href;
    if(/:\/\//.test(url))return url; // url is absolute
    // let's try a simple hack..
    var basea=document.createElement('a'), urla=document.createElement('a');
    basea.href=base, urla.href=url;
    urla.protocol=basea.protocol;// "inherit" the base's protocol and hostname
    if(!/^\/\//.test(url))urla.hostname=basea.hostname; //..hostname only if url is not protocol-relative  though
    if( /^\//.test(url) )return urla.href; // url starts with /, we're done
    var urlparts=url.split(/\//); // create arrays for the url and base directory paths
    var baseparts=basea.pathname.split(/\//); 
    if( ! /\/$/.test(base) )baseparts.pop(); // if base has a file name after last /, pop it off
    while( urlparts[0]=='..' ){baseparts.pop();urlparts.shift();} // remove .. parts from url and corresponding directory levels from base
    urla.pathname=baseparts.join('/')+'/'+urlparts.join('/');
    return urla.href;
  }
   
   return {
      ajax : ajax,
      logError : logError,
      absolute : absolute
   };

})(jQuery);