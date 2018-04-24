var helper = require("./content_helpers.js"),
    newsfeedEl = "",
    logic = {
        loggedId: "", // previously saved infocus element id
        getEmptyObj: function() {
            return {
                // all array unless def. only one value
                "postUrl": undefined, // url of the user's post you see, could be a shared post
                "postActivity": undefined, // basically why you are seeing this post
                "posters": [], // users that are responsible for you seeing that post with their ids and type (page or user)
                "postImg": undefined, // image or thumbnail of that post
                "postDesc": [], // what did they say
                "origLink": [], // what they shared (if at all)
                "origPoster": undefined, // who they shared it from (if at all)
                "origDesc": [], // what the shared content says (if at all)
                "suggested": [0, 0], // is it a suggested and sponsored post
                "duration": 0, // later can delete all with duration 0
                "timestamp": helper.now()
            };
        },
        logLooked: function(_obj, _sec, callback) {
            if (_sec >= window.minLookedDuration && _obj.postActivity.length > 0) {
                _obj.duration = _sec;
                _obj.timestamp = moment(helper.now()).subtract(_sec, 'seconds').format();
                helper.sendToBg("saveLooked", _obj);
                console.log("looked", _sec + " >= " + window.minLookedDuration, _obj.postActivity);
            };
            if (callback) { callback(); }
        }
    }

module.exports = {
    logic: logic, // separated from exports because of scoping problem
    getPagePosts: function() {
        var posts = newsfeedEl.find("div._4-u2.mbm._5v3q._4-u8").children($("div._3ccb._4-u8"));
        // console.log(posts);
        return posts;
    },
    updateNewsFeed: function() {
        newsfeedEl = $("#stream_pagelet");
    },
    init: function() {
        this.updateNewsFeed();
    }
};
