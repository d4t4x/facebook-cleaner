//
// General functions
//

// 3 sections (Interests, Advertisers, Your Information) should be open
function openSections(callback) {
    var closeSections = $("._2qo9");
    for (var i = 0; i < 3; i++) {
        var className = closeSections[i].classList.value;
        if (className.indexOf("hidden_elem") > -1) {
            // open closed/hidden sections
            closeSections[i].click();
        }
    }
    callback();
}

// Iterate through clicking the boxes in view
function actuallyClick(index, buttons, callback) {
    buttons[index].click();
    index++;
    if (index < buttons.length) {
        setTimeout(function() {
            actuallyClick(index, buttons, callback);
            // create a delay so the click can be registered
        }, 200);
    } else {
        callback();
    }
}

// Restores checkbox state using the preferences stored in chrome.storage.local -- copy from settings.js
function restoreOptions() {
    chrome.storage.local.get({
        ['clean-1']: false,
        ['clean-2']: false,
        ['clean-3']: false
    }, function(items) {
        document.getElementById('clean-1').checked = items['clean-1'];
        document.getElementById('clean-2').checked = items['clean-2'];
        document.getElementById('clean-3').checked = items['clean-3'];
    });
}

// Listens to changes to the checkboxes and updates chrome.storage.local -- copy from settings.js
function listenerFunction() {
    // first checkbox
    document.getElementById('clean-1').addEventListener('change', function(items) {
        var value1 = document.getElementById('clean-1').checked; // true or false
        chrome.storage.local.set({ 'clean-1': value1 }); // update chrome storage
        chrome.storage.local.get(null, function(data) { console.info(data) }); // console.log
    })

    // second checkbox
    document.getElementById('clean-2').addEventListener('change', function(items) {
        var value2 = document.getElementById('clean-2').checked; // true or false
        chrome.storage.local.set({ 'clean-2': value2 }); // update chrome storage
        chrome.storage.local.get(null, function(data) { console.info(data) }); // console.log
    })

    // third checkbox
    document.getElementById('clean-3').addEventListener('change', function(items) {
        var value3 = document.getElementById('clean-3').checked; // true or false
        chrome.storage.local.set({ 'clean-3': value3 }); // update chrome storage
        chrome.storage.local.get(null, function(data) { console.info(data) }); // console.log
    })
}


//
// "Interests" functions
//

// Get the most up to date state of the section
function getSectionDom(index) {
    var sections = $("._2qo2");
    return $(sections[index]);
}

function clickSeeMore(callback) {
    var section = getSectionDom(0);
    var className = "._45yr";
    section.find(className).click();
    setTimeout(function() {
        if (section.find(className).length > 0) {
            clickSeeMore(callback);
        } else {
            if (callback != "") {
                callback();
            }
        }
    }, 500);
}

function clickMoreDropdown(interestsSection, callback) {
    var more = interestsSection.find("._1b0");
    more.on('click', function() {
        // wait for the menu to load
        setTimeout(callback, 2000);
        console.log("Clicked More");
    });
    more.click();
}

function getDropdownLinks() {
    return $("._54nh");
}

function test(index, links, names) {
    links[index].click();
    // remove the clicked one (=first)
    names.splice(0, 1);
    console.log("Not clicked yet", names);

    setTimeout(function() {
        var interestsSection = getSectionDom(0);
        var likes = interestsSection.find("._2b2n");
        if (names.length > 0) {
            actuallyClick(0, likes, function() {
                clickMoreDropdown(getSectionDom(0), function() {
                    links = getDropdownLinks();
                    for (var i = 0; i < links.length; i++) {
                        // console.log("compare", i, links[i].innerText, names[0]);
                        if (links[i].innerText == names[0]) {
                            test(i, links, names);
                            break;
                        }
                    }
                });
            });
        }
    }, 1000);
}

function interestsDropdownTabs() {
    var links = getDropdownLinks();
    var dropdownTabsNames = [];
    links.each(function(i) {
        var name = links[i].innerText;
        dropdownTabsNames.push(name);
        if (i == links.length - 1) {
            console.log(dropdownTabsNames);
            test(0, links, dropdownTabsNames);
        }
    });
}

// Iterate through clicking the tabs
function interestsTabs(i, tabs, section) {
    var title = tabs[i].innerText;
    tabs[i].click();
    clickSeeMore(function() {
        var likes = section.find("._2b2n");
        console.log(title, likes.length);
        if (likes.length > 0) {
            actuallyClick(0, likes, function() {
                console.log("done", title);
                i++;
                if (i < tabs.length) {
                    interestsTabs(i, tabs, section);
                } else {
                    console.log("Done Interests tabs");
                    // after clicking the dropdown, go through them
                    clickMoreDropdown(section, interestsDropdownTabs);
                }
            });
        };
    });
}

// First section
function cleanInterests() {
    console.log("Cleaning all the interests.");
    var interestsSection = getSectionDom(0);
    var tabs = interestsSection.find("._4xjz");
    interestsTabs(0, tabs, interestsSection);
}


function reAddInterests() {
    console.log("Readding all the interests.");
    var interestsSection = getSectionDom(0);

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
        clickMoreDropdown(interestsSection, showRemovedInterests);
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
        clickSeeMore(function() {
            var likes = interestsSection.find("._2b2m");
            if (likes.length > 0) {
                actuallyClick(0, likes, function() {
                    console.log("Removed interests readded", likes.length);
                });
            };
        });
    }
}

// Second section
function cleanAdvertisers() {
    console.log("Cleaning advertisers you've interacted with");
    ////////////// optimize, so no need to close the other sections
    ///
    ///
    ///

    // var sections = $("._2qo6");
    // // Scroll second section into view
    // sections[1].scrollIntoView();
    // var tabs = $("._4jq5");
    // // Click each tab
    // for (f = 0; f < tabs.length; f++) {
    //     tabs[f].click();
    //     // Click each advert
    //     var adverts = $("._2b2n");
    //     for (g = 0; g < adverts.length; g++) {
    //         try {
    //             adverts[g].click();
    //         } catch (e) {
    //             console.log("Error");
    //         }
    //     }
    // };
    // // Click the 'More' tab
    // var more = $("._1b0");
    // more.click();
    // console.log("clicked more");
    // // click the more categories
    // var more_tabs = $("._54nh");
    // for (n = 0; n < (more_tabs.length - 1); n++) {
    //     more_tabs[n].click();
    //     console.log("clicked more tabs");
    //     // Click each advert
    //     var adverts = $("._2b2n");
    //     for (g = 0; g < adverts.length; g++) {
    //         try {
    //             adverts[g].click();
    //             console.log("clicked advertisers");
    //         } catch (e) {
    //             console.log("Error");
    //         }
    //     }
    // };
}

// Third section
function cleanYourCategories() {
    console.log("Cleaning your categories");
    ////////////// optimize, so no need to close the other sections
    ///
    ///

    // var sections = $("._2qoe");
    // sections.css('position', 'relative');
    // sections.css('z-index', 1);
    // sections.attr("style", "visibility: visible");
    // // Scrolled third section into view
    // sections[2].scrollIntoView();
    // console.log("clicked section");
    // // Click each tab
    // var tabs = $("._4jq5");
    // tabs[1].click();
    // console.log("clicked tab");
    // // Click each category
    // var categories = $(".sp_ZetlE9Uhzgq_2x");
    // categories.css('position', 'relative');
    // categories.css('z-index', 1);
    // categories.attr("style", "visibility: visible");
    // for (z = 0; z < categories.length; z++) {
    //     categories[z].click();
    //     console.log("clicked category");
    // };
}

$(window).load(function() {
    console.log("Yooo. Ready to clean!");

    restoreOptions();

    // adding UI elements
    $("#ads_preferences_desktop_root")
        .append($("<div>", { id: "ads-overlay" })
            .append($("<h1>").text("Facebook Cleaner"))
            .append($("<p>").text("Choose what you want to get rid of."))
            .append($("<form>", { id: "clean-options" })
                .append($("<label>", { class: "container" }).text("Remove Ad Interests")
                    .append($("<input>", { id: "clean-1", type: "checkbox" }))
                    .append($("<span>", { class: "checkmark" }))
                )
                .append($("<label>", { class: "container" }).text("Remove Advertisers")
                    .append($("<input>", { id: "clean-2", type: "checkbox" }))
                    .append($("<span>", { class: "checkmark" }))
                )
                .append($("<label>", { class: "container" }).text("Remove Your Categories")
                    .append($("<input>", { id: "clean-3", type: "checkbox" }))
                    .append($("<span>", { class: "checkmark" }))
                )
                .hide()
            )
            .append($("<button>", { id: "start-clean", class: "high button" }).text("Start Cleaning").hide())
            .append($("<button>", { id: "readd-content", class: "low button" }).text("Readd All Removed Items").hide())
        );
    openSections(function() {
        // after opening all the sections show the options/buttons
        setTimeout(function() {
            $("#clean-options").show();
            $(".button").show();
            listenerFunction();
        }, 1500);
        $("#start-clean").click(function() {
            chrome.storage.local.get(function(data) {
                console.log(data);
                if (data['clean-1'] == true) {
                    cleanInterests();
                }
                if (data['clean-2'] == true) {
                    cleanAdvertisers();
                }
                if (data['clean-3'] == true) {
                    cleanYourCategories();
                }
            });
        });
        $("#readd-content").click(function() {
            reAddInterests();
            // readd advertisers
            // readd your categories
        });
    });
});