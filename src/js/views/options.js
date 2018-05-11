require("../../css/main.scss");

chrome.storage.local.get(["options"], function(data) {

    document.querySelector('#cleanNotif').value = data.options.notification;
    document.querySelector('#cleanAlert').checked = data.options.alert;

    document.querySelector('#updateAlarmOption').addEventListener("click", function() {
        var notification = document.querySelector('#cleanNotif').value;
        var alert = document.querySelector('#cleanAlert').checked;
        chrome.storage.local.set({
            options: {
                notification: notification,
                alert: alert
            }
        });
        chrome.runtime.sendMessage({
            type: "updateAlarm",
            data: [notification, alert]
        });
    });
});