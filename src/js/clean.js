var general = require("./clean_general.js"),
    cleanExec = require("./clean_sections.js");


var start = function() {
    console.log("\n\n\n\nYooo. Ready to clean!! Content page document.readyState: ", document.readyState);
    general.restoreOptions();
    general.addingUIElems();
    general.openSections(function() {
        // after opening all the sections show the options/buttons
        setTimeout(function() {
            $(".section-checkbox").show();
            $("#checked-categories").fadeIn();
            $(".button").fadeIn();
            general.listenerFunction();
            $("#readd-interests").click(function() {
                cleanExec.reAddInterests();
            });
        }, 1500);
        $("#start-clean").click(function() {
            chrome.storage.local.get(['clean-1', 'clean-2', 'clean-3'], function(data) {
                console.log(data);
                if (data['clean-1'] == true) {
                    cleanExec.cleanInterests();
                }
                if (data['clean-2'] == true) {
                    cleanExec.cleanAdvertisers();
                }
                if (data['clean-3'] == true) {
                    cleanExec.cleanYourInfo();
                }
            });
        });
    });
};

document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        start();
    }
}