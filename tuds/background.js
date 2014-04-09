var Status="stop";
// send msg to all tabs
function sendCommand(cmd) {
        chrome.tabs.query({
            windowId: chrome.windows.WINDOW_ID_CURRENT
        }, function(tabs){
            for(var i = tabs.length - 1; i > -1; --i) {
                chrome.tabs.sendMessage(tabs[i].id,{greeting: cmd});
            }
        });
    }
	
chrome.windows.onCreated.addListener(function(id) {
        Status = 'stop';
        chrome.browserAction.setIcon({
            path:"stop.png"
        });
        chrome.browserAction.setTitle({
            title:'start catch'
        });
        sendCommand(Status);
    });
	
chrome.browserAction.onClicked.addListener(function(tab){
            if(Status === 'stop'){
                Status = 'start';
                chrome.browserAction.setIcon({
                    path:"start.png"
                });
                chrome.browserAction.setTitle({
                    title:'start catch'
                });
            } else {
                Status = 'stop';
                chrome.browserAction.setIcon({
                    path:"stop.png"
                });
                chrome.browserAction.setTitle({
                    title:'stop catch'
                });
            }

            sendCommand(Status);
        });
chrome.tabs.onCreated.addListener(function(tab){
            sendCommand(Status);
        });
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){

    chrome.tabs.sendMessage(tab.id,{greeting: Status});

});