window.onload = function(){
    restore_options();
    document.getElementById("save-button").addEventListener("click",save_options);
};

// Saves options to chrome.storage.
function save_options() {
    chrome.storage.sync.set({
        isNotificationEnabled: document.getElementById("is-notification-enabled").checked,
        mioUrl: document.getElementById("mio-url").value
    },function() {
        if (chrome.runtime.lastError) {
            showMessage("<font color='#FF0000'>Failed to save...</font>");
        } else {
            showMessage("Saved!");
        }
    });
}

// Restores select box state to saved value from chrome.storage.
function restore_options() {
    chrome.storage.sync.get(["isNotificationEnabled", "mioUrl"],function(items){
        var isNotificationEnabled = (items.isNotificationEnabled == undefined) ? true : items.isNotificationEnabled;
        document.getElementById("is-notification-enabled").checked = isNotificationEnabled;
        document.getElementById("mio-url").value = items.mioUrl || '';
    });
}

function showMessage(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
    setTimeout(function() {
        status.innerHTML = "";
    }, 3000);
}
