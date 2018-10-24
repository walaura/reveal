chrome.browserAction.onClicked.addListener(function(activeTab) {
	chrome.tabs.executeScript(null, { file: 'content.js' });
	chrome.tabs.insertCSS(null, { file: 'content.css' });
});
