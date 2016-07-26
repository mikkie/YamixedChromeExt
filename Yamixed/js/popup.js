POPUP = (function($){

  var ELS_IDS = {
	 NEW_MIX : 'newMix'	  
  };	
  
  var bind = {
	 newMix : function(){
	   $('#' + ELS_IDS.NEW_MIX).click(function(){
	   	  chrome.tabs.query({active : true}, function(tabs) {
             var tab = tabs[0];
             chrome.tabs.sendRequest(tab.id,{title : tab.title,url : tab.url},function(response) {
                
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