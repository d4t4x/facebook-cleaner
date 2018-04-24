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

var helper = require("./content_helpers.js"),
    kickoff = {
        listeners: function() {
            chrome.runtime.onMessage.addListener(function(req, sen, res) {
                if (req.webRequest) {
                    looked.updateNewsFeed();
                }
            });
        }
    };

var start = function() {
    console.log("\n\n\n\n\nYay! Content page document.readyState: ", document.readyState);
    // this class can change anytime
    // and could easily be the reason why tracking will stop working
    var info = $("#pagelet_bluebar a._2s25").has("img");
    if (info.length > 0) {
        // this is the beginning, bg only starts tracking
        // if profle img / logged in
        helper.sendToBg("contentLoaded", [1]); // session true
        console.log("Tracking on this page.");
        kickoff.listeners();
        looked.init();
    } else {
        helper.sendToBg("contentLoaded", [0]); // session false
        console.log("Boo! No tracking on this page. Only activity in your newsfeed are tracked. Check https://github.com/d4t4x/data-selfie/issues");
    };
}

document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        start();
    }
}