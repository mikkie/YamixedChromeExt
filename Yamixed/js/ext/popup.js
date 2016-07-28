POPUP = (function($){

  var ELS_IDS = {
	  NEW_MIX : 'newMix'	  
  };


  var getCategories = function(){
    var categories = null;
    COMMON.ajax({
      url : CONFIG.host + CONFIG.url.getCategories,
      type : 'get',
      async : false,
      callback : function(data){
        categories = data;  
      }
    });
    return categories;
  };	
  
  var bind = {
	 newMix : function(){
	   $('#' + ELS_IDS.NEW_MIX).click(function(){
	   	  chrome.tabs.query({active : true}, function(tabs) {
             var tab = tabs[0];
             chrome.tabs.sendMessage(tab.id,{title : tab.title,url : tab.url},function(response) {
                var categories = getCategories();
                if(categories){
                   window.sessionStorage.setItem('newMix',JSON.stringify({'mix' : response,'categories' : categories}));
                   window.location.href="newMix.html";
                }
                else{
                   COMMON.logError('can not get categories');
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
  };	
	
  return {
	  init : init
  }	
})(jQuery);
$(document).ready(POPUP.init);