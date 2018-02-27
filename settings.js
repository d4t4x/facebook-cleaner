$( document ).ready(function() {

  // Restores checkbox state using the preferences stored in chrome.storage.local
  function restoreOptions() {
      chrome.storage.local.get({
          ['clean-1']: false,
          ['clean-2']: false,
          ['clean-3']: false
      }, function (items) {
          document.getElementById('clean-1').checked = items['clean-1'];
          document.getElementById('clean-2').checked = items['clean-2'];
          document.getElementById('clean-3').checked = items['clean-3'];
      });
  }

  // Listens to changes to the checkboxes and updates chrome.storage.local
  function listenerFunction() {
    // first checkbox
    document.getElementById('clean-1').addEventListener('change', function(items) {
      var value1 = document.getElementById('clean-1').checked; // true or false
      chrome.storage.local.set({'clean-1': value1}); // update chrome storage
      chrome.storage.local.get(null, function (data) { console.info(data) }); // console.log
    })

    // second checkbox
    document.getElementById('clean-2').addEventListener('change', function(items) {
      var value2 = document.getElementById('clean-2').checked; // true or false
      chrome.storage.local.set({'clean-2': value2}); // update chrome storage
      chrome.storage.local.get(null, function (data) { console.info(data) }); // console.log
    })

    // third checkbox
    document.getElementById('clean-3').addEventListener('change', function(items) {
      var value3 = document.getElementById('clean-3').checked; // true or false
      chrome.storage.local.set({'clean-3': value3}); // update chrome storage
      chrome.storage.local.get(null, function (data) { console.info(data) }); // console.log
    })
  }

    chrome.storage.local.get(null, function (data) {console.info(data)}); // console.log
    // chrome.storage.local.clear();


  restoreOptions();
  listenerFunction();

})
