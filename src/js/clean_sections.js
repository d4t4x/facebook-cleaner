window.debugMode = false;
var general = require("./clean_general.js");
var template = [{ type: "interests", data: [] }, { type: "advertisers", data: [] }, { type: "info", data: [] }];
var removedTemp = [{ type: "interests", data: [] }, { type: "advertisers", data: [] }, { type: "info", data: [] }];
var interestsMoreDropDown = false;

function recordCleanData(secI) {
    var date = moment();
    if (removedTemp[secI].data.length > 0) {
        removedTemp[secI] = {
            unix: date.unix(),
            timestamp: date.format(),
            type: removedTemp[secI].type,
            removed: removedTemp[secI].data
        };
        chrome.runtime.sendMessage({
            type: "saveCleanTime",
            data: removedTemp[secI]
        });
        console.log("Recorded", removedTemp[secI]);
        removedTemp[secI] = template[secI];
    } else {
        console.log("Nothing cleaned.");
    }
}

function addToTemp(index, title, items) {
    console.log(title, items);
    if (items.length > 0) {
        removedTemp[index].data.push({
            title: title,
            items: items
        });
    }
}

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

function getDropdownLinks(moreId) {
    var dropDown = $(".uiLayer[data-ownerid='" + moreId + "']");
    console.log("Dropdown uiLayer", dropDown);
    return dropDown.find("._54nh");
}

function cleanTabsFromDropdown(index, links, names, sectionI) {
    var title = links[index].innerText;
    links[index].click();
    console.log("clicked", title);
    // remove the clicked one (i.e. the first)
    names.splice(0, 1);
    console.log("Not clicked yet", names);

    setTimeout(function() {
        var section = general.getSectionDom(sectionI);
        var items = section.find("._2b2n");
        var otherItems = section.find("._2b2p");
        console.log(title, items.length, otherItems.length);

        // if the boxes with just x-remove button are not there, instead the items with dropdown are there
        // iterate through those
        if (otherItems.length > items.length) {
            items = otherItems;
        }

        if (names.length >= 0) {
            general.actuallyClick(sectionI, 0, items, [], function(d) {
                addToTemp(sectionI, title, d);
                if (names.length === 0) {
                    recordCleanData(sectionI);
                } else {
                    general.clickMoreDropdown(sectionI, general.getSectionDom(sectionI), function(s, moreId) {
                        links = getDropdownLinks(moreId);
                        for (var i = 0; i < links.length; i++) {
                            // console.log("compare", i, links[i].innerText, names[0]);
                            if (links[i].innerText == names[0] && names.length > 0) {
                                cleanTabsFromDropdown(i, links, names, sectionI);
                                break;
                            }
                        }
                    });
                }
            });
        }
    }, 1000);
}

function sectionDropdownTabs(sectionI, moreId) {
    var links = getDropdownLinks(moreId);
    // advertisers removed content "Whom you've hidden" should be skipped
    // assumes: that link is in dropdown and is always last
    // if Removed Interests are in the dropdown
    // also assumes: it's last
    if (sectionI === 1 || interestsMoreDropDown === true) {
        links = _.take(links, links.length - 1);
    };
    var dropdownTabsNames = [];
    for (var i = 0; i < links.length; i++) {
        var name = links[i].innerText;
        dropdownTabsNames.push(name);
        if (i == links.length - 1) {
            console.log("Dropdown links", dropdownTabsNames);
            cleanTabsFromDropdown(0, links, dropdownTabsNames, sectionI);
        }
    }
}

// Iterate through clicking the tabs
function interestsTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 0;
    clickSeeMore(secNo, function() {
        var likes = section.find("._2b2n");
        console.log(title, likes.length);
        general.actuallyClick(secNo, 0, likes, [], function(d) {
            // after done with clicking
            addToTemp(secNo, title, d);
            console.log("done", title);
            i++;
            if (i < tabs.length) {
                interestsTabs(i, tabs, section);
            } else {
                console.log("Done Interests tabs");
                if (interestsMoreDropDown) {
                    // after clicking the dropdown, go through them
                    general.clickMoreDropdown(0, section, sectionDropdownTabs);
                } else {
                    recordCleanData(0);
                }
            }
        });
    });
}

function adsTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 1;
    clickSeeMore(secNo, function() {
        var items = section.find("._2b2n");
        var otherItems = section.find("._2b2h");
        console.log(title, items.length, otherItems.length);

        // if the boxes with just x-remove button are not there and the items with dropdown are there
        // iterate through those
        if (otherItems.length > items.length) {
            items = otherItems;
        }

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
        general.actuallyClick(secNo, 0, items, [], function(d) {
            addToTemp(secNo, title, d);
            logic();
        });
    });
}

function infoTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    var secNo = 2;
    clickSeeMore(secNo, function() {
        var items = [];
        section.find("._zom").each(function() {
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
                recordCleanData(secNo);
                // no dropdown as of now
            }
        }
        general.actuallyClick(secNo, 0, items, [], function(d) {
            addToTemp(secNo, title, d);
            logic();
        });
    });
}

module.exports = {
    cleanInterests: function(executedIn) {
        console.log(">>> Cleaning all the interests.");
        var interestsSection = general.getSectionDom(0);
        var tabs = interestsSection.find("._4xjz");
        // check if removed content is in the dropdown
        var moreExists = interestsSection.find("._1b0").length;
        if (moreExists > 0) {
            interestsMoreDropDown = true;
            // if there is a more dropdown and user browses - order gets messed up
            // click first tab + get the current dom again, so clicking is aligned with records saved
            tabs.on("click", function() {
                tabs.off();
                setTimeout(function() {
                    interestsSection = general.getSectionDom(0);
                    tabs = interestsSection.find("._4xjz");
                    interestsTabs(0, tabs, interestsSection);
                    executedIn(tabs.length * 2000 + 1000 + 3 * 2000); // estimated time to execute
                }, 800);
            });
            tabs[0].click();
        } else {
            // if there is no dropdown then Removed Interests should be last tab
            // skip it by removing it
            tabs = _.take(tabs, tabs.length - 1);
            if (tabs.length > 0) {
                interestsTabs(0, tabs, interestsSection);
                executedIn(tabs.length * 2000); // estimated time to execute
            } else {
                console.log("Nothing to clean");
                executedIn(0);
            }
        }
    },
    cleanAdvertisers: function() {
        console.log(">>> Cleaning advertisers.");
        var adsSection = general.getSectionDom(1);
        var tabs = adsSection.find("._4jq5");
        // click first tab + get the current dom again, so clicking is aligned with records saved
        tabs.on("click", function() {
            tabs.off();
            setTimeout(function() {
                adsSection = general.getSectionDom(1);
                tabs = adsSection.find("._4jq5");
                adsTabs(0, tabs, adsSection);
            }, 800);
        });
        tabs[0].click();
    },
    cleanYourInfo: function() {
        console.log(">>> Cleaning all your info.");
        var infoSection = general.getSectionDom(2);
        var tabs = infoSection.find("._4jq5");
        // assumes first tab: "About you" - skip it
        infoTabs(1, tabs, infoSection);
    },
    reAddInterests: function() {
        var secNo = 0;
        console.log(">>> Readding all the interests.");
        var interestsSection = general.getSectionDom(secNo);

        // only time the Removed Interests is a tab (not hidden in More) is when all Interests are removed
        // then Removed Interests is the first tab
        // other option: just click tab and then click Readd button
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
            // Assumes: Removed Interests seems to always be the last link in the dropdown
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
                    general.actuallyClick(secNo, 0, likes, [], function(d) {
                        console.log(d);
                        console.log("Removed interests readded", likes.length);
                    });
                };
            });
        }
    }
}