// var likes = document.getElementsByClassName("._2b2p");
// document.getElementsByTagName("button").getAttribute("title");
// likes = document.querySelectorAll("[title='Remove']")

var DEBUG = false;

// First section - interests
function cleanFacebookInterests(){
    // Click each tab
    tabs = $("._4xjz");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].click();
    // Click each like
      likes = $("._2b2n");
      for (y = 0; y < likes.length; y++) {
        likes[y].click();
      }
    };
    // Close the section
    sections = $("._2qo6");
    sections[0].click();
};

// Second section - advertisers you've interacted with
function cleanFacebookAds(){
  // Open the section
  sections = $("._2qo6");
  sections[1].scrollIntoView();
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
  // TODO: fix the 'more tabs'
  // more_tabs = $("._1b0");
  // Close the section
  sections[1].click();
};

// Third section - categories
function cleanFacebookCategories(){
  // Open the section
  sections = $("._2qo6");
  sections[2].scrollIntoView();
  sections[2].click();
  // Click each tab
  tabs = $("._4jq5");
  tabs[1].click();
  // Click each category
  categories = $(".sx_40ddf0");
  categories.css('position', 'relative');
  categories.css('z-index', 1);
  categories.attr("style", "visibility: visible");
  // console.log(categories);
  for (z = 0; z < categories.length; z++) {
    console.log(categories[z]);
    categories[z].click();
  };
  // Close the section
  sections[2].click();
};

function startCleaning(){
  setTimeout(cleanFacebookInterests, 5000);
  setTimeout(cleanFacebookAds, 10000);
  setTimeout(cleanFacebookCategories, 10000);

};

startCleaning();

// var scroller = _.debounce(startCleaning, 300);
// document.addEventListener("scroll", scroller);
