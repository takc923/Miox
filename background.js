var tabMap = {};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

function notice (args, sender) {
    chrome.windows.get(sender.tab.windowId, function(win) {
        if (! sender.tab.active || ! win.focused) {
            chrome.notifications.create(args.id, args.options, function(notificationId){
                tabMap[notificationId] = sender.tab;
            });
        }
    });
}

function isActive(args, sender, sendResponse) {
    chrome.windows.get(sender.tab.windowId, function(win) {
        sendResponse({isActive: sender.tab.active && win.focused});
    });
    return true;
}

chrome.notifications.onClicked.addListener(function(notificationId){
    chrome.tabs.update(tabMap[notificationId].id, {active: true});
    chrome.windows.update(tabMap[notificationId].windowId, {focused: true});
});
