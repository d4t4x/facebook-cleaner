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

function removeInterests(i, tabs, section) {
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
                    removeInterests(i, tabs, section);
                } else {
                    console.log("done tabs");
                }
            });
        };
    });
}

function cleanInterests() {
    console.log("Cleaning all the interests.");
    var interestsSection = getSectionDom();
    var tabs = interestsSection.find("._4xjz");
    removeInterests(0, tabs, interestsSection);
}


function getSectionDom() {
    var sections = $("._2qo2");
    return $(sections[0]);
}


function clickSeeMore(callback) {
    var section = getSectionDom();
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


function reAddInterests() {
    console.log("Readding all the interests.");
    var interestsSection = getSectionDom();

    // only time the Removed Interests is a tab (not hidden in More) is when all Interests are removed
    // then Removed Interests is the first tab
    var boxes = interestsSection.find("._2b2m");
    // check first tab
    if (boxes.length > 0) {
        console.log("Found interests that can be readded");
        clickRemovedInterests();
    } else {
        // otherwise it's in the More dropdown
        clickMoreDropdown(interestsSection, showRemovedInterests);
    }

    function showRemovedInterests() {
        // Removed Interests seems to always be the last link in the dropdown
        var lastLink = $("._54nf li").last();
        console.log(lastLink);
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

$(window).load(function() {
    console.log("Ready to clean!");
    openSections(function() {




        // comment out either to see each function
        setTimeout(reAddInterests, 2000);
        // setTimeout(cleanInterests, 2000);
    });
})