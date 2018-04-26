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

function showItems(arr) {
    console.log(arr);
    var stream = $("#stream");
    arr = _.sortBy(arr, "unix").reverse();
    var startDate = moment([2018, 0, 1]);
    var now = moment();

    // create divs for each year and month
    var timePassed = now.diff(startDate, 'years');
    for (var i = 0; i < (timePassed + 1); i++) { // +1 for current year
        var y = moment().subtract(i, "years").year();
        var monthArr = [];
        for (var m = 11; m >= 0; m--) {
            var date = moment([y, m, 1]);
            if (now.diff(date, "days") >= 0) {
                monthArr.push(date.format("MMMM"));
            }
        }
        stream.append($("<div>", { id: y, class: "year" })
            .append($("<h1>").text(y))
            .append($("<div>", { class: "month" })
                .append($("<div>", { id: y + monthArr[0], name: y + monthArr[0] })
                    .append($("<h2>").text(monthArr[0]))
                )
                .append($("<div>", { id: y + monthArr[1], name: y + monthArr[1] })
                    .append($("<h2>").text(monthArr[1]))
                )
                .append($("<div>", { id: y + monthArr[2], name: y + monthArr[2] })
                    .append($("<h2>").text(monthArr[2]))
                )
                .append($("<div>", { id: y + monthArr[3], name: y + monthArr[3] })
                    .append($("<h2>").text(monthArr[3]))
                )
                .append($("<div>", { id: y + monthArr[4], name: y + monthArr[4] })
                    .append($("<h2>").text(monthArr[4]))
                )
                .append($("<div>", { id: y + monthArr[5], name: y + monthArr[5] })
                    .append($("<h2>").text(monthArr[5]))
                )
                .append($("<div>", { id: y + monthArr[6], name: y + monthArr[6] })
                    .append($("<h2>").text(monthArr[6]))
                )
                .append($("<div>", { id: y + monthArr[7], name: y + monthArr[7] })
                    .append($("<h2>").text(monthArr[7]))
                )
                .append($("<div>", { id: y + monthArr[8], name: y + monthArr[8] })
                    .append($("<h2>").text(monthArr[8]))
                )
                .append($("<div>", { id: y + monthArr[9], name: y + monthArr[9] })
                    .append($("<h2>").text(monthArr[9]))
                )
                .append($("<div>", { id: y + monthArr[10], name: y + monthArr[10] })
                    .append($("<h2>").text(monthArr[10]))
                )
                .append($("<div>", { id: y + monthArr[11], name: y + monthArr[11] })
                    .append($("<h2>").text(monthArr[11]))
                )
            )
        );
        // table of content with anchor links
        $("#toc").append($("<div>", { id: "toc" + y, class: "tocyear" })
            .append($("<h3>").text(y))
            .append($("<ul>", { class: "tocmonth" })
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[0] }).text(monthArr[0])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[1] }).text(monthArr[1])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[2] }).text(monthArr[2])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[3] }).text(monthArr[3])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[4] }).text(monthArr[4])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[5] }).text(monthArr[5])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[6] }).text(monthArr[6])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[7] }).text(monthArr[7])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[8] }).text(monthArr[8])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[9] }).text(monthArr[9])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[10] }).text(monthArr[10])))
                .append($("<li>").append($("<a>", { href: "#" + y + monthArr[11] }).text(monthArr[11])))
            )
        );
    }




    for (var i = 0; i < arr.length; i++) {
        var time = moment(arr[i].timestamp);
        stream.find("#" + time.year() + time.format("MMMM")).append($("<div>", { class: "item" })
            .append($("<p>").text(time.format("MMMM DD, YYYY - HH:mm:ss")))
            .append($("<p>").text(arr[i].postActivity))
            .append($("<img>", { src: arr[i].postImgRaw[0] }))
            .append($("<p>").text(arr[i].postDesc))
            .append($("<p>").text(arr[i].origLink))
            .append($("<p>").text(arr[i].origPoster))
            .append($("<p>").text(arr[i].origDesc))
            .append($("<p>").text(arr[i].suggested))
            .append($("<p>").text(arr[i].sponsored.replace(" · ", "")))
        );
    }
}

var main = {
    initDB: function() {
        db = new Dexie("TargetBlankLocalDB");
        db.version(1).stores(dbstores);
        db.open().catch(function(err) {
            console.log("%c[DB][<<] error", helper.clog.magenta);
            console.error(err.stack || err);
        }).finally(function() {
            console.log("%c[DB][<<] opened", helper.clog.magenta);
            db.items.toArray(function(arr) {
                // check if db has content
                if (arr.length > 0) {
                    $("#message").text("You're data base has " + arr.length + " records.");
                    showItems(arr);
                } else {
                    $("#message").text("You haven't collected any sponsored posts yet.");
                }
            });
        });
    },
}

$(document).ready(function() {
    main.initDB();
    console.log("Kaboom. Me page loaded.");
});