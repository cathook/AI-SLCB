chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf('http://agar.io') >= 0 ||
      tab.url.indexOf('https://agar.io') >= 0) {
    chrome.pageAction.show(tabId);
  }
});
