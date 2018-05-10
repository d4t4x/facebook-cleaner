// This file is part of Target ___.

// Target ___ is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// Target ___ is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Target ___.  If not, see <http://www.gnu.org/licenses/>.

var greeting = "HELLO TARGET ___ <3",
    devMode = true,
    db,
    session = false,
    helper = require("./background_helpers.js"),
    dbstores = require("./dbstores.js");

function generalListeners() {
    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.create({ url: chrome.runtime.getURL("views/me.html") });
        chrome.browserAction.setBadgeText({ text: "" });
    });
    chrome.runtime.onUpdateAvailable.addListener(function(details) {
        chrome.browserAction.setBadgeText({ text: "!" });
        chrome.runtime.reload();
    });
    chrome.runtime.onInstalled.addListener(function(details) {
        console.log("onInstalled", details.reason);
    });
    chrome.alarms.onAlarm.addListener(function(){
        console.log("Clean alarm");
        alert("It's time to clean your ads prefereneces");
        chrome.browserAction.setBadgeText({ text: "!" });
    });
    chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
        switch (req.type) {
            case "backup":
                helper.backup(db);
                break;
            case "openStream":
                chrome.tabs.create({ url: chrome.runtime.getURL("views/me.html") });
                break;
            case "import":
                if (req.data.dataselfie != undefined) {
                    helper.import(db, req.data.dataselfie, sender.tab.id);
                } else {
                    helper.importError(sender.tab.id);
                }
                break;
            case "delete":
                helper.resetDB(db, initDB, sender.tab.id);
                chrome.storage.local.clear(initOptions);
                break;
            case "saveItem":
                db.items.add(req.data);
                break;
            case "saveCleanTime":
                db.cleaning.add(req.data);
                chrome.alarms.clear("clean-alarm", function(wasCleared){
                    console.log("Clean alarm was cleared " + wasCleared);
                    setAlarm();
                });
                break;
        }
        return true;
    });
    var lastWebReq = 0;
    chrome.webRequest.onCompleted.addListener(function(info) {
        var dif = info.timeStamp - lastWebReq;
        // limit the number of notifications sent to content
        if (dif > 1500 || lastWebReq == 0) {
            helper.sendToContent(info.tabId);
            console.log("%c[>>] new webRequest", helper.clog.fb);
        }
        lastWebReq = info.timeStamp;
    }, {
        urls: ["https://www.facebook.com/*", "http://www.facebook.com/*"]
    }, []);
}

function setAlarm() {
    // for debugging, time should be adjusted
    var firstAlarm = Date.now() + 5000; // ms
    chrome.alarms.create("clean-alarm", { when: firstAlarm, periodInMinutes: 5 });
    console.log("Clean alarm was created ", firstAlarm);
}

function initDB(notify) {
    // if db already exists, dexie only opens
    db = new Dexie("TargetBlankLocalDB");
    db.version(1).stores(dbstores);
    db.open().catch(function(err) {
        console.log("%c[DB][<<] error", helper.clog.magenta);
        console.error(err.stack || err);
        alert("There has been an error. Database was not initiated.");
    }).finally(function() {
        console.log("%c[DB][<<] opened", helper.clog.magenta);
        // FIX might not need
        if (notify != false) {
            console.log("Database was initiated.");
        }
    });
}

function init() {
    console.log("%c" + greeting, helper.clog.lime);
    initDB(false);
    setAlarm();
    generalListeners();
    helper.getPermissions();
}

init();