var DEBUG = false;

// First section - interests
function cleanFacebookInterests(){
  // Open the section
  sections = $("._2qo6");
  sections[0].click();
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

function startCleaning() {
  // Check if box 1 is checked
  chrome.storage.sync.get('clean-1', function(data){
      if (data['clean-1'] == true){
        setTimeout(cleanFacebookInterests, 5000);
      }
  });
  // Check if box 2 is checked
  chrome.storage.sync.get('clean-2', function(data){
      if (data['clean-2'] == true){
        setTimeout(cleanFacebookAds, 10000);
      }
  });
  // Check if box 3 is checked
  chrome.storage.sync.get('clean-3', function(data){
      if (data['clean-3'] == true){
        setTimeout(cleanFacebookCategories, 10000);
      }
  });

};

startCleaning();
