CONTENT = (function(){

  var parseMix = function(request){
  	 var title = request.title;
  	 var url = request.url;
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
         images.push($(n).attr('src'));
       }
     });
     return {
       url : url,
       title : title,
       description : description,
       images : images
     };
  }; 

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  	var mix = parseMix(request);
    sendResponse(mix); 
  });
})();