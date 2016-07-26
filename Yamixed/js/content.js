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


  var getCategories = function(){
    var categories = null;
    $.ajax({
  		url : CONFIG.host + '/rest/api/v1/category/all',
  		beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + Base64.encode(CONFIG.basicAuth.username + ":" + CONFIG.basicAuth.password));
      },
  		type : 'get',
  		dataType : 'json',
      async : false
  	}).done(function(data){
        categories = data;  
  	});
    return categories;
  };

   
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  	var mix = parseMix(request);
    var categories = getCategories();
    sendResponse({'mix' : mix,'categories' : categories}); 
  	// alert('title=' + mix.title + ',url=' + mix.url + ',description=' + mix.description);
  });
})();