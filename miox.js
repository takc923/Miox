document.onreadystatechange = function () {
    var defaultTitle = document.title;
    if (document.readyState != "complete") return;
    chrome.storage.sync.get("mioUrl", function(items) {
        if (! isMioHome(items.mioUrl)) return;

        var tweets = document.querySelector(".tweets ul");
        tweets.addEventListener("DOMSubtreeModified",function(){
            chrome.runtime.sendMessage({
                action: "isActive"
            }, function(res){
                if (res.isActive) return;
                incrementTitleUnreadCount();
                notice();
            });
        });

        window.addEventListener("focus", function (){
            document.title = defaultTitle;
        });

        document.getElementById("body").onkeypress = function(evt){
            if (evt.keyCode == 13 && evt.shiftKey) {
                document.getElementsByName("commit")[0].click();
                return false;
            }
        };
    });
};

function notice() {
    chrome.storage.sync.get("isNotificationEnabled", function(items) {
        if (! items.isNotificationEnabled) return;

        chrome.runtime.sendMessage({
            action : "notice",
            args: {
                id: document.querySelector(".tweet").id,
                options: {
                    type: "basic",
                    title: document.querySelector(".tweet .user").textContent.trim(),
                    message: document.querySelector(".tweet .body").textContent,
                    iconUrl: document.querySelector(".tweet img").src
                }
            }
        });
    });
}

function incrementTitleUnreadCount() {
    if (document.title.search(/^\[[0-9]+\] /) == -1) document.title = "[1] " + document.title;
    else document.title = document.title.replace(/([0-9]+)/, function(title, num) {return ++num;});
}

function isMioHome(mioUrl) {
    var currentPage = document.querySelector(".page.current");
    return mioUrl != undefined && location.href.indexOf(mioUrl) != -1
        && currentPage && currentPage.innerHTML.trim() == "1";
}
