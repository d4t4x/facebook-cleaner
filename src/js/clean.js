var general = require("./clean_general.js"),
    cleanExec = require("./clean_sections.js"),
    text = require("./translations.js");

function startClean() {
    console.log("start cleaning");
    $("#start-clean").fadeTo(0.5);
    chrome.storage.local.get(['clean-1', 'clean-2', 'clean-3'], function(data) {
        console.log(data);

        // have kind of a sequence to the cleaning
        function secondPhase() {
            if (data['clean-2'] == true) {
                cleanExec.cleanAdvertisers();
            }
            if (data['clean-3'] == true) {
                cleanExec.cleanYourInfo();
            }
        }

        if (data['clean-1'] == true) {
            cleanExec.cleanInterests(function(ms) {
                console.log("Estimated time", ms);
                setTimeout(secondPhase, ms);
            });
        } else {
            secondPhase();
        }
    });
    setTimeout(function() {
        $("#start-clean").fadeTo(1);
    }, 2000);
}

function start() {
    console.log("\n\n\n\nYooo. Ready to clean!! Content page document.readyState: ", document.readyState);
    // Restores checkbox state using prev preferences
    var restoredCheckboxes,
        localtext;
    chrome.storage.local.get(null, function(data) {
        restoredCheckboxes = data;
        localtext = text[data.options.lang]
        general.addingUIElems(localtext);
        $("#start-clean").click(startClean);
        $("#stream-link").click(function() {
            chrome.runtime.sendMessage({ type: "openStream" });
        });
    });
    general.openSections(function() {
        // after opening all the sections show the options/buttons
        setTimeout(function() {
            $(".content").fadeIn();
            $(".section-checkbox").show();
            general.restoreOptions(restoredCheckboxes, localtext);
            general.listenerFunction(localtext);
            $("#readd-interests").click(function() {
                cleanExec.reAddInterests();
            });
        }, 1500);
    });
};

document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        start();
    }
}