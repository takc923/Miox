chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var result = onMsgDispatcher[request.action](request.args, sender);
        sendResponse(result);
    }
);

var onMsgDispatcher = {
    notice: function (args, sender) {
        chrome.windows.get(sender.tab.windowId, function(win) {
            if (! sender.tab.active || ! win.focused) {
                chrome.notifications.create(args.id, args.options, function(){});
            }
        });
    }
};
