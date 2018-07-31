module.exports = {
    openSections: function(callback) { // 3 sections (Interests, Advertisers, Your Information) should be open
        var closeSections = $("._2qo9");
        for (var i = 0; i < 3; i++) {
            var className = closeSections[i].classList.value;
            if (className.indexOf("hidden_elem") > -1) {
                // open closed/hidden sections
                closeSections[i].click();
            }
        }
        callback();
    },
    getSectionDom: function(index) { // Get the most up to date state of the section
        var sections = $("._2qo2");
        return $(sections[index]);
    },
    clickMoreDropdown: function(sectionI, section, callback) {
        var more = section.find("._1b0");
        more.on('click', function() {
            more.off();
            // wait for the menu to load
            setTimeout(function() {
                var id = more.parent("a")[0].id;
                console.log("Clicked More", id);
                callback(sectionI, id);
            }, 800);
        });
        more.click();
    },
    actuallyClick: function(section, index, buttons, clickedArr, callback) { // Iterate through clicking the boxes in view
        var self = this;
        if (buttons.length > 0) {
            switch (section) {
                case 0:
                    var parent = $(buttons[index]).parents("._3viq").find("._qm-");
                    break;
                case 1:
                    var parent = $(buttons[index]).parents("._2b2e").find("._3vin");
                    break;
                case 2:
                    var parent = $(buttons[index]).parents("._zoj").find("div");
                    break;
            }
            parent.css("color", "red");
            // click to remove/clean this category/advertiser
            if (window.debugMode === false) {
                // x-remove button or dropdown button (advertiser section)
                buttons[index].click();
            };

            // rest of function after time out, to make sure the dropdown menu was loaded
            setTimeout(function() {
                var otherButtons = $("span._o6j");
                // assumes: so far only advertisers will have the dropdown to remove sth
                if (otherButtons.length > 0 && section === 1) {
                    // text stating ads from this advertiser are hidden
                    var clickedAdvertiserHidden = $(buttons[index]).parents("._2b2e").find("._qm-").length;
                    // since the menus will appear one by one after the buttons of each element is clicked
                    if (clickedAdvertiserHidden === 0) {
                        otherButtons[clickedArr.length].click();
                        clickedArr.push(parent.text());
                    } else {
                        // hide menu again
                        $("body").click();
                    }
                } else {
                    // no otherButtons means just x-remove, add the text to arr
                    clickedArr.push(parent.text());
                }

                index++;
                if (index < buttons.length) {
                    setTimeout(function() {
                        // click next
                        self.actuallyClick(section, index, buttons, clickedArr, callback);
                        // create a delay so the click can be registered
                    }, 200);
                } else {
                    callback(clickedArr);
                }
            }, 50);
        } else {
            callback(clickedArr);
        }
    },
    updateCheckedCategoriesText: function(items, localtext) {
        var checkedCategories = [];
        if (items['clean-1']) { checkedCategories.push(localtext.clean1) };
        if (items['clean-2']) { checkedCategories.push(localtext.clean2) };
        if (items['clean-3']) { checkedCategories.push(localtext.clean3) };
        if (checkedCategories.length > 0) {
            $("#checked-categories").text(localtext.cleanselected).append($("<span>", { class: "highlight" }).text(_.join(checkedCategories, ", ")));
            $("#start-clean").removeClass("low");
        } else {
            $("#checked-categories").text(localtext.cleanempty);
            $("#start-clean").addClass("low");
        }
    },
    restoreOptions: function(items, localtext) {
        document.getElementById('clean-1').checked = items['clean-1'];
        document.getElementById('clean-2').checked = items['clean-2'];
        document.getElementById('clean-3').checked = items['clean-3'];
        this.updateCheckedCategoriesText(items, localtext);
    },
    addingUIElems: function(localtext) {
        $("#ads_preferences_desktop_root")
            .append($("<div>", { id: "ads-overlay" }).fadeIn()
                .append($("<p>", { class: "content" }).text(localtext.cleandescription)
                    .prepend($("<b>").text("Fuzzify.me")))
                .append($("<p>", { id: "checked-categories", class: "content" }).hide())
                .append($("<div>", { class: "content flex" }).hide()
                    .append($("<button>", { id: "start-clean", class: "button" }).text(localtext.cleanchecked))
                    .append($("<button>", { id: "stream-link", class: "special" }).text(localtext.adsstream))
                )
                .append($("<div>", { class: "content flex" }).hide()
                    .append($("<label>", { class: "container" }).text(localtext.debug)
                        .append($("<input>", { id: "debug", type: "checkbox" }))
                        .append($("<span>", { class: "checkmark" }))
                    )
                )
            );

        for (var i = 0; i < 3; i++) {
            $(this.getSectionDom(i))
                .prepend($("<div>", { class: "section-checkbox" }).hide()
                    .append($("<form>", { class: "clean-checkboxes" })
                        .append($("<label>", { class: "container" }).text(localtext.cleantab)
                            .append($("<input>", { id: "clean-" + (i + 1), type: "checkbox" }))
                            .append($("<span>", { class: "checkmark" }))
                        )
                    )
                );
            if (i === 0) {
                $(".section-checkbox").first().append($("<button>", { id: "readd-interests", class: "button" }).text(localtext.readdinterests))
            }
        }
    },
    listenerFunction: function(localtext) { // Listens to changes to the checkboxes and updates chrome.storage.local
        var self = this;
        var arr = ['clean-1', 'clean-2', 'clean-3'];

        for (var i = 0; i < arr.length; i++) {
            $("#" + arr[i]).change(function(e) {
                var obj = {};
                var key = e.target.id;
                obj[key] = e.target.checked;
                chrome.storage.local.set(obj);
                chrome.storage.local.get(arr, function(data) {
                    console.info(data);
                    self.updateCheckedCategoriesText(data, localtext);
                });
            })
        }
        $("#debug").change(function(e) {
            window.debugMode = e.target.checked;
            console.log("DebugMode", e.target.checked);
        });
    }
}