chrome.notifications.onClicked.addListener(function(notificationId){
    chrome.tabs.create({
        url: notificationId
    });
});