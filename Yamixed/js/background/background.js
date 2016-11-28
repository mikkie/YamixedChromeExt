(function init(){
  chrome.tabs.query({},function(tabs){
    for(var i in tabs){
        var tab = tabs[i];
        if (tab.url.indexOf('chrome://extensions/') != 0){
          chrome.tabs.executeScript(tab.id, {file: "jquery/jquery-1.11.1.min.js",matchAboutBlank:true});
          chrome.tabs.executeScript(tab.id, {file: "js/common/common.js",matchAboutBlank:true});
          chrome.tabs.executeScript(tab.id, {file: "js/common/hotkeys.js",matchAboutBlank:true});
          chrome.tabs.executeScript(tab.id, {file: "js/common/highlight.js",matchAboutBlank:true});
          chrome.tabs.executeScript(tab.id, {file: "js/content/content.js",matchAboutBlank:true});
        }
    }
  });
})();
  
var checkForValidUrl = function(tab) {
  if (tab.url.indexOf('chrome://extensions/') != 0){
    chrome.pageAction.show(tab.id);
  }
};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	checkForValidUrl(tab);
});
chrome.tabs.onActivated.addListener(function(activeInfo){
   chrome.tabs.get(activeInfo.tabId,checkForValidUrl);
});

chrome.notifications.onClicked.addListener(function(notificationId){
	if(notificationId.indexOf('http') == 0){
      chrome.tabs.create({
        url: notificationId
      });
	}
});


chrome.runtime.onMessage.addListener(function (msg, sender,sendResponse) {
  if(msg.action == 'syncBookmark'){
    chrome.bookmarks.getTree(function(nodes){
      sendResponse(nodes);
    });
    return true;
  }
  sendMessageToActivePage(msg,function(response) {
    sendResponse(response);
  });
  //fix by aqua. :))
  //The sendResponse callback is only valid if used synchronously, 
  //or if the event handler returns true to indicate that it will respond asynchronously. 
  //The sendMessage function's callback will be invoked automatically if no handlers 
  //return true or if the sendResponse callback is garbage-collected.
  return true;
});


var sendMessageToActivePage = function(message,callback){
     chrome.tabs.query({active : true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id,$.extend({},{tab : tab},message),function(response,tab){
            callback(response);
        });
     });
};

String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
};

chrome.omnibox.onInputChanged.addListener(function(text,suggest){
   if(text && text.length > 1){
      Y_COMMON.service.getLogindUser(function(data){
        if(data.user){
          Service.searchLinksFromAddressBar(data.user._id,$.trim(text)).done(function(data){
            if(data.success && data.success.length > 0){
              var result = [];
              for(var i in data.success){
                result.push({
                  content : data.success[i].url,
                  description : data.success[i].title.encodeHTML()
                });
              }
              suggest(result);   
            }
          });
        }  
      });
   }
});


chrome.omnibox.onInputEntered.addListener(function(text,disposition){
   window.open(text);
});