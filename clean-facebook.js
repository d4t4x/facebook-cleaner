// var likes = document.getElementsByClassName("._2b2p");
// document.getElementsByTagName("button").getAttribute("title");
// likes = document.querySelectorAll("[title='Remove']")

var DEBUG = false;

// First section - interests
function cleanFacebookInterests(){
    tabs = $("._4xjz");
    // Click each tab
    for (i = 0; i < tabs.length; i++) {
      tabs[i].click();
    // Click each like
      likes = $("._2b2n");
      for (y = 0; y < likes.length; y++) {
        likes[y].click();
      }
    };
    sections = $("._2qo6");
    sections[0].click();
};

// Second section - advertisers you've interacted with
function cleanFacebookAds(){
  sections = $("._2qo6");
  sections[1].click();

  tabs = $("._4jq5");
  // Click each tab
  for (f = 0; f < tabs.length; f++) {
    tabs[f].click();
  // Click each advert
    adverts = $("._2b2n");
    for (g = 0; g < adverts.length; g++) {
      adverts[g].click();
    }
  };

  more_tabs = $("._1b0");
  sections[1].click();
};

// Third section - categories
function cleanFacebookCategories(){
  sections = $("._2qo6");
  sections[2].click();

  tabs = $("._4jq5");
  tabs[1].click();

  // Click each category
  categories = $("._zom");
  console.log(categories);
  for (z = 0; z < categories.length; z++) {
    categories[z].click();
  }

};

setTimeout(cleanFacebookInterests, 5000);
// setTimeout(cleanFacebookAds, 10000);
setTimeout(cleanFacebookCategories, 5000);


// var scroller = _.debounce(cleanFacebookAds, 300);
// document.addEventListener("scroll", scroller);
