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
    var sortedArr = _.sortBy(arr, "unix");
    // timeline start
    var startDate = moment.unix(sortedArr[0].unix);
    var now = moment().add(0, "months");

    var stream = $("#stream");
    arr = sortedArr.reverse();
    console.log(arr);

    // create divs for each year and month
    var timePassed = now.diff(startDate, 'years');
    for (var i = 0; i < (timePassed + 1); i++) { // +1 for current year
        // iterate by going back in years
        var y = moment().subtract(i, "years").year();

        // array of month names
        var monthArr = [];
        for (var m = 11; m >= 0; m--) {
            var date = moment([y, m, 1]);
            console.log(startDate.format("YYYY MMMM DD"), date.format("YYYY MMMM DD"), now.diff(date, "days"), date.diff(startDate, "months"));
            // check for only past months and after the first ad was recorded
            if (now.diff(date, "days") >= 0 && date.diff(startDate, "months") >= 0) {
                monthArr.push(date.format("MMMM"));
            }
        }

        // divs for each month
        var monthsDiv = $("<div>");
        for (var i = 0; i < monthArr.length; i++) {
            monthsDiv.append($("<div>", { class: "month", id: y + monthArr[i], name: y + monthArr[i] })
                .append($("<h2>").text(monthArr[i]))
            )
        }
        stream.append($("<div>", { id: y, class: "year" })
            .append($("<h1>").text(y))
            .append(monthsDiv)
        );

        // table of content with anchor links to each month
        var ul = $("<ul>", { class: "tocmonth" });
        for (var i = 0; i < monthArr.length; i++) {
            ul.append($("<li>").append($("<a>", { href: "#" + y + monthArr[i] }).text(monthArr[i])));
        }

        $("#toc").append($("<div>", { id: "toc" + y, class: "tocyear" })
            .append($("<h3>").text(y))
            .append(ul)
        );
    }

    // populate and add items
    for (var i = 0; i < arr.length; i++) {
        var time = moment(arr[i].timestamp);
        if (arr[i].removed != undefined) {
            var removeDiv = $("<div>", { class: "clean", id: "d" + arr[i].unix });
            var removeList = $("<ul>");

            for (var j = 0; j < arr[i].removed.length; j++) {
                removeList.append($("<li>")
                    .append($("<u>").text(arr[i].removed[j].title))
                    .append($("<p>").text(_.join(arr[i].removed[j].items, ", ")))
                );
            };

            removeDiv.append($("<h4>").text(time.format("MMMM DD, YYYY - HH:mm:ss")))
                .append($("<p>").text("You have cleaned your preferences and removed: "))
                .append(removeList);

            stream.find("#" + time.year() + time.format("MMMM")).append(removeDiv);
        } else {
            // console.log("Posters", arr[i].posters, "last", _.last(arr[i].posters));
            var name = arr[i].origPoster === undefined ? _.last(arr[i].posters).name : arr[i].origPoster.name,
                activity = name === arr[i].postActivity ? "" : arr[i].postActivity;

            if (arr[i].rationale != "" && arr[i].rationale != undefined) {
                var json = JSON.parse(arr[i].rationale.replace("for (;;);", ""));
                var html = json.jsmods.markup[0][1].__html;
                var rationaleT = $(html).find("._4uoz").text();
            }

            stream.find("#" + time.year() + time.format("MMMM"))
                .append($("<div>", { class: "item", id: "d" + arr[i].unix })
                    .append($("<p>", { class: "name" }).text(name))
                    .append($("<p>").text(activity))
                    .append($("<p>", { class: "date" }).text(time.format("MMMM DD, YYYY - HH:mm:ss")))
                    .append($("<img>", { src: arr[i].postImgRaw[0] }))
                    .append($("<p>").text(_.join(arr[i].postDesc, "\n\n")))
                    .append($("<p>").text(_.join(arr[i].origLink, "\n\n")))
                    .append($("<p>").text(_.join(arr[i].origDesc, "\n\n")))
                    .append($("<p>", {class: "rationale"}).text(rationaleT))
                );
        }
        if (i === arr.length - 1) {
            $("#loading").hide();
        }
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
            var arr = [];
            var cleanArr = [];
            db.cleaning.each(function(d, i) {
                cleanArr.push(d);
            });
            db.items.count(function(count) {
                // check if db has content
                if (count > 0) {
                    $("#records").text(count + " record(s) in your database");
                    db.items.each(function(d, i) {
                        arr.push(d);
                        if (arr.length === count) {
                            showItems(_.concat(arr, cleanArr));
                            var lastTime = moment(_.last(cleanArr).timestamp);
                            var now = moment();
                            var diff = now.diff(lastTime, "days");
                            $("#cleanings").text(diff + " day(s) since last cleaning");
                            if (diff > 7) {
                                $("#cleanings").css("color", "red");
                            };
                        }
                    });
                } else {
                    $("#records").text("You haven't collected any sponsored posts yet.");
                }

            });
        });
    },
    listener: function() {
        $('#go-to-options').click(function() {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('options.html'));
            }
        });
    }
}

main.initDB();
main.listener();