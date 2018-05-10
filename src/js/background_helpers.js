var clog = {
    fb: "color: rgb(80, 100, 220)",
    red: "color: red",
    magenta: "color: magenta",
    blue: "color: blue",
    teal: "color: teal",
    grey: "color: silver",
    lime: "color: lime"
};
module.exports = {
    clog: clog,
    now: function() {
        return moment().format();
    },
    getPermissions: function() {
        chrome.permissions.getAll(function(p) {
            console.log("%c[Permissions][<<] " + _.join(p.permissions, " - "), clog.grey);
        });
    },
    sendToContent: function(tabid) {
        chrome.tabs.sendMessage(tabid, { webRequest: 1 });
    },
    saveBackup: function(data, name) {
        console.log("[DB][<<] backup", data);
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/json;charset=utf-8" })
        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: "dataselfie_" + name + "_" + moment().format('YYYY-MM-DD') + ".json",
            conflictAction: "overwrite", // "uniquify" / "overwrite" / "prompt"
            saveAs: true // true gives save-as dialogue
        }, this.downloadBar());
    },
    backup: function(_db) {
        var self = this;
        var obj = { dataselfieconsumption: {} };
        _db.transaction('r', _db.tables, function() {
            _db.tables.forEach(function(table) {
                table.toArray().then(function(sessions) {
                    obj.dataselfieconsumption[table.name] = sessions;
                });
            })
        }).then(function() {
            self.saveBackup(obj, "consumption");
        }).catch(function(err) {
            console.error(err.stack);
        });
    },
    importError: function(tabid) {
        console.log("%c[DB][<<] import (json) error", clog.magenta);
        chrome.tabs.sendMessage(tabid, {
            displaydata: true,
            msg: "There has been error. Please make sure your file is a valid json and try importing again."
        });
    },
    import: function(_db, data, tabid) {
        var self = this;
        _db.transaction("rw", _db.looked, _db.clicked, _db.typed, _db.timespent, _db.pages, function() {
            for (var i = 0; i < data.looked.length; i++) {
                _db.looked.add(_.omit(data.looked[i], ['id']));
            }
            for (var i = 0; i < data.clicked.length; i++) {
                _db.clicked.add(_.omit(data.clicked[i], ['id']));
            }
            for (var i = 0; i < data.typed.length; i++) {
                _db.typed.add(_.omit(data.typed[i], ['id']));
            }
            for (var i = 0; i < data.timespent.length; i++) {
                _db.timespent.add(_.omit(data.timespent[i], ['id']));
            }
            for (var i = 0; i < data.pages.length; i++) {
                _db.pages.add(_.omit(data.pages[i], ['id']));
            }
        }).then(function() {
            console.log("%c[DB][<<] import complete", clog.magenta);
            chrome.tabs.sendMessage(tabid, {
                displaydata: true,
                msg: "Data was imported."
            });
        }).catch(function(err) {
            console.error(err.stack);
            self.importError();
        });
    },
    resetDB: function(_db, _callback, tabid) {
        _db.delete().then(function() {
            console.log("%c[DB][<<] deleted", clog.magenta);
        }).catch(function(err) {
            console.error("%cCould not delete [DB][<<]", clog.magenta);
        }).finally(function() {
            if (_callback) { _callback(); };
            chrome.tabs.sendMessage(tabid, {
                displaydata: true,
                msg: "Database was deleted."
            });
        });
    },
    escapeString: function(str) {
        // return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(/"/g, '\\"');
    },
    replaceAll: function(str, find, replace) {
        // http://stackoverflow.com/a/1144788
        return str.replace(new RegExp(this.escapeString(find), 'g'), replace);
    }
}