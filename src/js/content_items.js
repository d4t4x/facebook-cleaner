var helper = require("./content_helpers.js"),
    newsfeedEl = "",
    sessionItems = [], // keep track of the posts in session so they are not added again, when content script is reloaded the array is empty again
    logic = {
        getEmptyObj: function() {
            return {
                // all array unless def. only one value
                "postId": "", // some id, probably not the post id
                "postUrl": "", // url of the user's post you see, could be a shared post
                "postActivity": "", // basically why you are seeing this post
                "posters": [], // users that are responsible for you seeing that post with their ids and type (page or user)
                "postImg": "", // image or thumbnail of that post
                "postImgRaw": [], // img data in base64
                "postDesc": [], // what did they say
                "origLink": [], // what they shared (if at all)
                "origPoster": "", // who they shared it from (if at all)
                "origDesc": [], // what the shared content says (if at all)
                "rationale": "",
                "sponsored": "",
                "timestamp": helper.now(),
                "unix": helper.unix()
            };
        },
        getUserType: function(card) {
            var type = "other";
            if (card.indexOf("user") > -1) {
                type = "user";
            } else if (card.indexOf("page") > -1) {
                type = "page";
            };
            return type;
        },
        populateObj: function(postObj, _postId, suggestedText) {
            var self = this,
                postData = this.getEmptyObj();

            postData.postId = _postId;

            // url nested in date, but if sponsored usually there is no url
            postData.postUrl = postObj.find("a._5pcq").attr("href");

            // just get one image from all images in the post
            var imgs = postObj.find("img");
            if (postObj.find("video").length > 0) {
                if (imgs.filter("._3chq").length > 0) {
                    postData.postImg = imgs.filter("._3chq").attr("src");
                } else {
                    postData.postImg = imgs.filter(function() {
                        return ($(this).width() > 100);
                    }).attr("src");
                }
            } else {
                postData.postImg = imgs.filter(function() {
                    return ($(this).attr("width") > 100 || $(this).width() > 100);
                }).attr("src");
            };

            // get whole description of post
            postObj.find("div._1dwg p").map(function() {
                postData.postDesc.push($(this).text());
            });

            // post usually shares something, get that
            var _origDesc = postObj.find("div._6m3");
            if (_origDesc.length > 0) {
                _origDesc.children().map(function() {
                    postData.origDesc.push($(this).text());
                });
            };

            // e.g. Sponsored instead of date, next to icon for audience (mostly public)
            postData.sponsored = suggestedText;

            // h5 e.g. Regina likes this.
            var h5 = postObj.find("h5");
            postData.postActivity = h5.text();
            h5.find("a").each(function(i) {
                var h5link = $(this);
                var card = h5link.attr("data-hovercard");
                if (card != undefined) {
                    var name = h5link.text(),
                        type = self.getUserType(card),
                        id = card.match(/\d{5,}/g)[0];
                    postData.posters.push({ name: name, type: type, id: id });
                } else if (h5link.attr("href") != "#") {
                    postData.origLink.push(h5link.attr("href"));
                }
            });

            // h6 e.g. New York Times (what Regina likes/interacted with)
            var h6 = postObj.find("h6._5pbw._5vra a")[0];
            if (h6) {
                var h6link = $(h6),
                    name = h6link.text(),
                    card = h6link.attr("data-hovercard"),
                    type = self.getUserType(card),
                    id = card.match(/\d{5,}/g)[0];
                postData.origPoster = { name: name, type: type, id: id };
            };

            console.log("%c" + suggestedText + " --- " + postData.postActivity, "color: #c667c1");
            console.log(postData.postActivity, postObj);
            if (postData.postImg != undefined) {
                // takes a little bit of time, so after it's done, save the whole item
                helper.convertImg(postData.postImg, function(data) {
                    postData.postImgRaw = data;
                    helper.sendToBg("saveItem", postData);
                });
            } else {
                helper.sendToBg("saveItem", postData);
            }
        }
    }

module.exports = {
    getPagePosts: function() {
        var posts = newsfeedEl.find("div._4-u2.mbm._5v3q._4-u8").children($("div._3ccb._4-u8"));
        return posts;
    },
    filterSponsored: function() {
        var posts = this.getPagePosts();
        // https://github.com/WhoTargetsMe/Who-Targets-Me/blob/master/src/daemon/page/FacebookAdvertObserver.js
        posts.each(function() {
            var thisEl = $(this),
                dateOrSponsored = thisEl.find("._5pcp"),
                postActiv = thisEl.find("h5").length;
            hasSponsored = dateOrSponsored.children().find("span.timestampContent").length, // 0, there is no date timestamp
                postId = thisEl.closest("div._5jmm")[0].attributes.id.value; // some id to distinguish the posts

            if (hasSponsored === 0 && postActiv > 0 && _.map(sessionItems, 'id').indexOf(postId) === -1) {
                // has "Sponsored" text and is indeed a post, not people you may now etc.
                // and also is not in the array from this session yet
                sessionItems.push({
                    id: postId,
                    ajaxify: "",
                    rationale: ""
                });
                thisEl.addClass("highlight");
                logic.populateObj(thisEl, postId, dateOrSponsored.text());
            };
        });
    },
    updateNewsFeed: function() {
        newsfeedEl = $("#stream_pagelet");
        this.filterSponsored();
    },
    rationaleCycle: function() {
        function getRationale(arrIndex) {
            // find the first empty one
            var index = _.findIndex(sessionItems, { 'rationale': "" });
            console.log("sessionItems", sessionItems);
            // if there is still an element in queue without rationale
            if (index >= 0) {
                var obj = sessionItems[index];
                var menu = $("#" + obj.id).find("._4xev._p")[0];
                var menuId = menu.id;
                menu.click(); // open menu

                console.log(index, obj.id, menuId);
                setTimeout(function() {
                    // https://github.com/WhoTargetsMe/Who-Targets-Me/blob/master/src/daemon/page/FacebookAdvertObserver.js
                    // sometimes no data-ownerid attribute in triggered uiLayer menu
                    // then try the last uiLayer as it gets updated and pushed to the button after click
                    var layer = $(".uiLayer[data-ownerid='" + menuId + "']");
                    if (layer.length === 0) {
                        layer = $(".uiLayer").last();
                    }
                    var ajaxify = layer.find("a[data-feed-option-name='FeedAdSeenReasonOption']").attr("ajaxify");

                    // menu.click(); // close menu
                    if (ajaxify === undefined) {
                        sessionItems[index].ajaxify = undefined;
                        sessionItems[index].rationale = undefined;
                    } else if (ajaxify.lastIndexOf("/ads/preferences/dialog/?", 0) === 0) {
                        sessionItems[index].ajaxify = ajaxify;
                        // console.log("ajaxify", ajaxify);
                        // var advertId = /id=\s*(.*?)\s*&/.exec(ajaxify)[1];
                        $.ajax({
                            url: "https://www.facebook.com" + ajaxify,
                            // url: "https://www.facebook.com/ads/preferences/dialog/?id=" + advertId + "&optout_url=http%%3A%%2F%%2Fwww.facebook.com%%2Fabout%%2Fads&page_type=16&show_ad_choices=0&dpr=1&__a=1",
                            type: "GET",
                            dataType: 'text',
                            xhrFields: {
                                withCredentials: true // include the user cookie to make call on behalf
                            }
                        }).done(function(data) {
                            console.log("%crationale dataaaa " + data.length + " " + obj.id , "color: #c667c1");
                            sessionItems[index].rationale = data;
                            helper.sendToBg("rationale", { id: obj.id, rationale: data });
                            // FIX error handling missing
                        });
                    }
                }, 500); // make sure menu was opened
            }
        };
        // get rationale once at the beginning
        getRationale();
        // then interval to get new rationales
        setInterval(getRationale, 30000);
    },
    init: function() {
        this.updateNewsFeed();
        // wait a bit before starting rationaleCycle
        setTimeout(this.rationaleCycle, 10000);
    }
};