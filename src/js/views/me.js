// This file is part of Data Selfie.

// Data Selfie is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// Data Selfie is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Data Selfie.  If not, see <http://www.gnu.org/licenses/>.

require("../../css/main.scss");
var helper = require("./me_helpers.js"),
    dbstores = require("../dbstores.js"),
    db,
    body = $("body");

var main = {
    initDB: function() {
        db = new Dexie("TargetBlankLocalDB");
        db.version(1).stores(dbstores);
        db.open().catch(function(err) {
            console.log("%c[DB][<<] error", helper.clog.magenta);
            console.error(err.stack || err);
        }).finally(function() {
            console.log("%c[DB][<<] opened", helper.clog.magenta);
            main.userInfo();
            db.looked.toArray(function(arr) {
                // check if db has content
                if (arr.length > 0) {
                    //
                } else {
                    //
                }
            });
        });
    },
}

$(document).ready(function() {
    main.initDB();
    console.log("Kaboom. Me page loaded.", helper.clog.green);
});