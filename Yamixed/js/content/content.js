CONTENT = (function(){

  var parseMix = function(message){
  	 var title = message.title;
  	 var url = message.url;
  	 var descs = $('meta').filter(function(){
  	   var name = $(this).attr('name');
  	   return name && name.toLowerCase().indexOf('description') > -1;
  	 });
  	 var description = '';
     if(descs.length > 0){
       description = descs[0].content == null ? '' : descs[0].content;
     } 
     var images = [];
     $('img').each(function(i,n){
       if(i < 20){
         var src = $(n).attr('src');
         if(src){
           src = COMMON.absolute(src);
           images.push(src);
         } 
       }
     });
     return {
       url : url,
       title : title,
       description : description,
       images : images
     };
  }; 

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  	var mix = parseMix(message);
    sendResponse(mix); 
  });
  
})();