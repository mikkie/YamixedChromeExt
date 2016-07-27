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
    chrome.tabs.create({
        url: notificationId
    });
});