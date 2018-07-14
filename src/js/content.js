// This file is part of Fuzzify.me.

// Fuzzify.me is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// Fuzzify.me is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Fuzzify.me.  If not, see <http://www.gnu.org/licenses/>.

var helper = require("./content_helpers.js"),
    items = require("./content_items.js"),
    kickoff = {
        listeners: function() {
            chrome.runtime.onMessage.addListener(function(req, sen, res) {
                if (req.webRequest) {
                    console.log(">>> New content loading.", req.webRequest);
                    items.updateNewsFeed();
                }
            });
        }
    };

var start = function() {
    console.log("\n\n\n\n\nYay! Content page document.readyState: ", document.readyState);
    // this class can change anytime
    // could be the reason why tracking doesn't work
    var info = $("#pagelet_bluebar a._2s25").has("img");
    if (info.length > 0 && (window.location.pathname.length === 1 || window.location.pathname.substring(0, 2) === "/?" )) {
        // this is the beginning, bg only starts tracking
        // if profle img is there / user is logged in
        console.log("Tracking on this page.");
        kickoff.listeners();
        items.init();
    } else {
        console.log("Boo! No tracking on this page. Only activity in your newsfeed is tracked.");
    };
}

document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        start();
    }
}