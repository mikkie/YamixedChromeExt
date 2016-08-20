var checkForValidUrl = function(tab) {
  if (/^(http|https)/.test(tab.url)){
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


chrome.runtime.onMessage.addListener(function (msg, sender) {
  sendMessageToActivePage(msg,function(response) {
    
  });
});


var sendMessageToActivePage = function(message,callback){
     chrome.tabs.query({active : true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id,$.extend({},{tab : tab},message),function(response,tab){
            callback(response);
        });
     });
};