require("../../css/main.scss");

var text = require("../translations.js");

function uiText(lang) {
    document.querySelector("h3").innerText = text[lang].optionstitle
    document.querySelector("#notif-label label").innerText = text[lang].cleannotif;
    document.querySelector("#lang-label").innerText = text[lang].chooselang;
    document.querySelector("#updateOption").innerText = text[lang].savebtn;
}

chrome.storage.local.get(["options"], function(data) {

    uiText(data.options.lang);

    document.querySelector('#cleanNotif').value = data.options.notification;
    document.querySelector("#" + data.options.lang).checked = true

    document.querySelector('#updateOption').addEventListener("click", function() {
        data.options.notification = document.querySelector('#cleanNotif').value;
        var langs = document.querySelectorAll('input[name="lang"]');
        for (var i = 0; i < langs.length; i++) {
            if (langs[i].checked) {
                data.options.lang = langs[i].value;
                uiText(data.options.lang);
            }
        }
        chrome.storage.local.set(data);
        chrome.runtime.sendMessage({
            type: "updateAlarm",
            data: []
        });
    });
});