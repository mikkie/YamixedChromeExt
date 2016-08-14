POPUP = (function($){

  var ELS_IDS = {
    HOME : 'home',
	  NEW_MIX : 'newMix',
    URM : 'urm'	  
  };


  var getCategories = function(cb){
    COMMON.ajax({
      url : CONFIG.host + CONFIG.url.getCategories,
      type : 'get',
      callback : function(data){
        cb(data);  
      }
    });
  };	
  

  var sendMessageToActivePage = function(message,callback){
     chrome.tabs.query({active : true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id,message,function(response){
            callback(response);
        });
     });
  };

  var bind = {
   go_home : function(){
      $('#' + ELS_IDS.HOME).click(function(){
         chrome.tabs.create({
           url: CONFIG.host
         });
      });
   },  
	 newMix : function(){
	   $('#' + ELS_IDS.NEW_MIX).click(function(){
	   	  sendMessageToActivePage({action : 'parseLink',title : tab.title,url : tab.url},function(response) {
            if(!response){
               COMMON.logError('当前页面努力加载中...，请刷新重试(F5)');
                  return;
            }
            getCategories(function(categories){
               if(categories){
                  window.sessionStorage.setItem('newMix',JSON.stringify({'mix' : response,'categories' : categories}));
                  window.location.href="newMix.html";
               }
               else{
                  COMMON.logError('服务正在神游中...');
               }
            });
        });
	   });	
	 },
   urm_start : function(){
     $('#' + ELS_IDS.URM).click(function(){
         sendMessageToActivePage({action : 'openUrm'},function(response) {
            window.close();
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