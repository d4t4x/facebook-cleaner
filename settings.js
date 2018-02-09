$(document).ready (function(){
  input = $('.clean-option');

    // set the initial state of the checkbox
    $(".clean_news_feed", function(data){
        if (data["clean_news_feed"]){
            input.checked = true;
        } else {
            input.checked = false;
        }
      });


    input.change(function() {
        chrome.storage.sync.set({clean_news_feed: input.checked});
    });


});
