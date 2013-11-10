document.onreadystatechange = function () {
    var defaultTitle = document.title;
    if (document.readyState != "complete") return;
    chrome.storage.sync.get("mioUrl", function(items) {
        if (! isMioHome(items.mioUrl)) return;
        document.querySelector(".tweets").addEventListener("DOMNodeInserted",function(){
            incrementTitleUnreadCount();
            notice(this);
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

function notice(tweets) {
    chrome.storage.sync.get("isNotificationEnabled", function(items) {
        if (! items.isNotificationEnabled) return;

        chrome.runtime.sendMessage({
            action : "notice",
            args: {
                id: tweets.querySelector(".tweet").id,
                options: {
                    type: "basic",
                    title: tweets.querySelector(".user").textContent.trim(),
                    message: tweets.querySelector(".body").innerHTML,
                    iconUrl: tweets.querySelector("img").src
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
