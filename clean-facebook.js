var DEBUG = false;

// First section - interests
function cleanFacebookInterests(){
  console.log("cleaning facebook interests");
  sections = $("._2qo6");
  // Click each tab
  tabs = $("._4xjz");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].click();
  // Click each like
    likes = $("._2b2n");
    for (y = 0; y < likes.length; y++) {
      try {
        likes[y].click();
      } catch (e) {
        console.log("Error");
      }
    }
  };
  // Click the 'More' tab
  var more = $("._1b0");
  more.click();
  console.log("clicked more");
  // click the more tabs
  var more_tabs = $("._54nh");
  for (l = 0; l < (more_tabs.length-1); l++) {
    more_tabs[l].click();
    console.log("clicked more tabs");
    // Click each advert
    var likes = $("._2b2n");
    for (r = 0; r < likes.length; r++) {
      try {
        likes[r].click();
        console.log("clicked advertisers");
      } catch (e) {
        console.log("Error");
      }
    }
  };
    // // Close the section
    // close_sections = $("._2qo9");
    // close_sections[0].click();
};

// Second section - advertisers you've interacted with
function cleanFacebookAds(){
  console.log("cleaning facebook ads");
  var sections = $("._2qo6");
  // Close the first section
  var close_sections = $("._2qo9");
  close_sections[0].click();
  // Open the second section
  sections[1].scrollIntoView();
  sections[1].click();

  var tabs = $("._4jq5");
  // Click each tab
  for (f = 0; f < tabs.length; f++) {
    tabs[f].click();
  // Click each advert
    var adverts = $("._2b2n");
    for (g = 0; g < adverts.length; g++) {
      try {
        adverts[g].click();
      } catch (e) {
        console.log("Error");
      }
    }
  };
  // Click the 'More' tab
  var more = $("._1b0");
  more.click();
  console.log("clicked more");
  // click the more categories
  var more_tabs = $("._54nh");
  for (n = 0; n < (more_tabs.length-1); n++) {
    more_tabs[n].click();
    console.log("clicked more tabs");
    // Click each advert
    var adverts = $("._2b2n");
    for (g = 0; g < adverts.length; g++) {
      try {
        adverts[g].click();
        console.log("clicked advertisers");
      } catch (e) {
        console.log("Error");
      }
    }
  };
  // // Close the section
  // sections[1].click();
};

// Third section - categories
function cleanFacebookCategories(){
  console.log("cleaning user categories");
  var sections = $("._2qoe");
  sections.css('position', 'relative');
  sections.css('z-index', 1);
  sections.attr("style", "visibility: visible");
  // Close the first section
  sections[0].click();
  // Open the third section
  sections[2].scrollIntoView();
  sections[2].click();
  console.log("clicked section");
  // Click each tab
  var tabs = $("._4jq5");
  tabs[1].click();
  console.log("clicked tab");
  // Click each category
  var categories = $(".sp_ZetlE9Uhzgq_2x");
  categories.css('position', 'relative');
  categories.css('z-index', 1);
  categories.attr("style", "visibility: visible");
  for (z = 0; z < categories.length; z++) {
      categories[z].click();
      console.log("clicked category");
  };
  // // Close the section
  // sections[2].click();
};

function startCleaning() {
  // Check if box 1 is checked
  chrome.storage.local.get('clean-1', function(data){
      if (data['clean-1'] == true){
        setTimeout(cleanFacebookInterests, 5000);
      }
  });
  // Check if box 2 is checked
  chrome.storage.local.get('clean-2', function(data){
      if (data['clean-2'] == true){
        setTimeout(cleanFacebookAds, 10000);
      }
  });
  // Check if box 3 is checked
  chrome.storage.local.get('clean-3', function(data){
      if (data['clean-3'] == true){
        setTimeout(cleanFacebookCategories, 10000);
      }
  });

};

startCleaning();
