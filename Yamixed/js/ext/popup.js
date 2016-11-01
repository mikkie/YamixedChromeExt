POPUP = (function($){

  var ELS_IDS = {
    HOME : 'home',
	  NEW_MIX : 'newMix',
    URM : 'urm',
    BOOK_MARK : 'bookmark'	  
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
        chrome.tabs.sendMessage(tab.id,$.extend({},{tab : tab},message),function(response,tab){
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
        chrome.tabs.query({active : true}, function(tabs) {
          var tab = tabs[0];
	   	    if(/^(http|https)/.test(tab.url)){
            sendMessageToActivePage({action : 'parseLink'},function(response) {
              if(!response){
                 COMMON.logError('Page is loading...，please refresh(F5)');
                    return;
              }
              getCategories(function(categories){
                 if(categories){
                    window.sessionStorage.setItem('newMix',JSON.stringify({'mix' : response,'categories' : categories}));
                    window.location.href="newMix.html";
                 }
                 else{
                    COMMON.logError('server is busy');
                 }
              });
            });
          }
          else{
              COMMON.logError('please publish in open web page');
          }
        });
	   });	
	 },
   urm_start : function(){
     $('#' + ELS_IDS.URM).click(function(){
         chrome.tabs.query({active : true}, function(tabs) {
           var tab = tabs[0];
           if(/^chrome:/.test(tab.url)){
              COMMON.logError('please open bookmarks manager in open web page');
              return false;
           }
           sendMessageToActivePage({action : 'openUrm'},function(response) {
               window.close();
           });
         });
     });
   },
   bookmark : function(){
     $('#' + ELS_IDS.BOOK_MARK).click(function(){
        chrome.tabs.query({active : true}, function(tabs) {
          var tab = tabs[0];
          if(/^(http|https)/.test(tab.url)){
            sendMessageToActivePage({action : 'openBookmark'},function(response) {
              window.close();
            });
          }
          else{
            COMMON.logError('please bookmark in open web page');
          }
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