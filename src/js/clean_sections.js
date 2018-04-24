var general = require("./clean_general.js");

function clickSeeMore(sectionI, callback) {
    var section = general.getSectionDom(sectionI);
    var className = "._45yr";
    section.find(className).click();
    setTimeout(function() {
        if (section.find(className).length > 0) {
            clickSeeMore(sectionI, callback);
        } else {
            if (callback != "") {
                callback();
            }
        }
    }, 500);
}

function getDropdownLinks() {
    return $("._54nh");
}

function cleanTabsFromDropdown(index, links, names, sectionI) {
    links[index].click();
    // remove the clicked one (=first)
    names.splice(0, 1);
    console.log("Not clicked yet", names);

    setTimeout(function() {
        var interestsSection = general.getSectionDom(sectionI);
        var likes = interestsSection.find("._2b2n");
        if (names.length > 0) {
            general.actuallyClick(0, likes, function() {
                general.clickMoreDropdown(sectionI, general.getSectionDom(sectionI), function() {
                    links = getDropdownLinks();
                    for (var i = 0; i < links.length; i++) {
                        // console.log("compare", i, links[i].innerText, names[0]);
                        if (links[i].innerText == names[0]) {
                            cleanTabsFromDropdown(i, links, names);
                            break;
                        }
                    }
                });
            });
        }
    }, 1000);
}

function sectionDropdownTabs(sectionI) {
    var links = getDropdownLinks();
    var dropdownTabsNames = [];
    links.each(function(i) {
        var name = links[i].innerText;
        dropdownTabsNames.push(name);
        if (i == links.length - 1) {
            console.log(dropdownTabsNames);
            cleanTabsFromDropdown(0, links, dropdownTabsNames, sectionI);
        }
    });
}

// Iterate through clicking the tabs
function interestsTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 0;
    clickSeeMore(secNo, function() {
        var likes = section.find("._2b2n");
        console.log(title, likes.length);
        if (likes.length > 0) {
            general.actuallyClick(0, likes, function() {
                console.log("done", title);
                i++;
                if (i < tabs.length) {
                    interestsTabs(i, tabs, section);
                } else {
                    console.log("Done Interests tabs");
                    // after clicking the dropdown, go through them
                    general.clickMoreDropdown(0, section, sectionDropdownTabs);
                }
            });
        };
    });
}

function adsTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 1;
    clickSeeMore(secNo, function() {
        var items = section.find("._2b2n");
        console.log(title, items.length);

        function logic() {
            console.log("done", title);
            i++;
            if (i < tabs.length) {
                adsTabs(i, tabs, section);
            } else {
                console.log("Done Advertisers tabs");
                // after clicking the dropdown, go through them
                general.clickMoreDropdown(1, section, sectionDropdownTabs);
            }
        }
        if (items.length > 0) {
            general.actuallyClick(0, items, function() {
                logic();
            });
        } else {
            // sometimes tabs won't contain boxes
            logic();
        };
    });
}

function infoTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 2;
    clickSeeMore(secNo, function() {
        var items = [];
        section.find("._zom").each(function(){
            items.push($(this).children("._gze._kcu").first().find("i"));
        });
        console.log(title, items.length);

        function logic() {
            console.log("done", title);
            i++;
            if (i < tabs.length) {
                infoTabs(i, tabs, section);
            } else {
                console.log("Done Info tabs");
                // no dropdown as of now
            }
        }
        if (items.length > 0) {
            general.actuallyClick(0, items, function() {
                logic();
            });
        } else {
            // sometimes tabs won't contain boxes
            logic();
        };
    });
}

module.exports = {
    cleanInterests: function() {
        console.log("Cleaning all the interests.");
        var interestsSection = general.getSectionDom(0);
        var tabs = interestsSection.find("._4xjz");
        interestsTabs(0, tabs, interestsSection);
    },
    cleanAdvertisers: function() {
        console.log("Cleaning advertisers.");
        var adsSection = general.getSectionDom(1);
        var tabs = adsSection.find("._4jq5");
        adsTabs(0, tabs, adsSection);
    },
    cleanYourInfo: function() {
        console.log("Cleaning all your info.");
        var infoSection = general.getSectionDom(2);
        var tabs = infoSection.find("._4jq5");
        // assumes first tab: "About you" - skip it
        infoTabs(1, tabs, infoSection);
    },
    reAddInterests: function() {
        console.log("Readding all the interests.");
        var interestsSection = general.getSectionDom(0);

        // only time the Removed Interests is a tab (not hidden in More) is when all Interests are removed
        // then Removed Interests is the first tab
        var boxes = interestsSection.find("._2b2m");
        // check first tab
        if (boxes.length > 0) {
            console.log("Found interests that can be readded");
            clickRemovedInterests();
        } else {
            // otherwise it's in the More dropdown
            // after clicking the dropdown, click the Removed Interests
            general.clickMoreDropdown(0, interestsSection, showRemovedInterests);
        }

        function showRemovedInterests() {
            // Assumption: Removed Interests seems to always be the last link in the dropdown
            var lastLink = $("._54nf li").last();
            lastLink.on('click', function() {
                console.log("Show Removed Interests");
                setTimeout(clickRemovedInterests, 1000);
            });
            lastLink.click();
        }

        function clickRemovedInterests() {
            clickSeeMore(0, function() {
                var likes = interestsSection.find("._2b2m");
                if (likes.length > 0) {
                    general.actuallyClick(0, likes, function() {
                        console.log("Removed interests readded", likes.length);
                    });
                };
            });
        }
    }
}