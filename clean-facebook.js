// var likes = document.getElementsByClassName("._2b2p");
// document.getElementsByTagName("button").getAttribute("title");
// likes = document.querySelectorAll("[title='Remove']")

var DEBUG = false;

function cleanFacebookInterests(){
    tabs = $("._4xjz");
    console.log(tabs);
    for (i = 0; i < tabs.length; i++) {
      tabs[i].click();

      likes = $("._2b2n");
      for (y = 0; y < likes.length; y++) {
        likes[y].click();
      }
      // TODO: Add 'See More' button
    };

};

function cleanFacebookAds(){
}

setTimeout(cleanFacebookInterests, 5000);

setTimeout(cleanFacebookAds, 5000);

//
// var scroller = _.debounce(cleanFacebookAds, 300);
// document.addEventListener("scroll", scroller);
