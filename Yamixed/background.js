chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "http://www.yamixed.com/";
  chrome.tabs.create({ url: newURL });
});