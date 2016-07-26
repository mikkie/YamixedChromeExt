CONTENT = (function(){
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  	console.log(request.title);
  	console.log(request.url);
  });
})();