// Import database functions
importScripts('db.js');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveLink') {
    saveLink(request.url, request.title, request.pageContent).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, message: error.message });
    });
    return true;
  }
  
  if (request.action === 'getAllLinks') {
    getAllLinks().then(links => {
      sendResponse({ success: true, links: links });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'deleteLink') {
    deleteLink(request.id).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.action === 'searchWithAI') {
    searchWithAI(request.query).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.action === 'getApiKey') {
    getApiKey().then(apiKey => {
      sendResponse({ success: true, apiKey: apiKey });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.action === 'saveApiKey') {
    saveApiKey(request.apiKey).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});
