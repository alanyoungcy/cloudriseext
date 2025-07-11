// Background service worker for Chrome Extension Manifest V3

let extensionWindow = null;

// Handle extension icon click
chrome.action.onClicked.addListener(async () => {
  try {
    // Check if window already exists and is still open
    if (extensionWindow) {
      try {
        const existingWindow = await chrome.windows.get(extensionWindow.id);
        if (existingWindow) {
          // Window exists, just focus it
          chrome.windows.update(extensionWindow.id, { focused: true });
          return;
        }
      } catch (error) {
        // Window doesn't exist anymore, will create a new one
        extensionWindow = null;
      }
    }

    // Create new window
    extensionWindow = await chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 400,
      height: 650,
      focused: true
    });

    // Clean up reference when window is closed
    chrome.windows.onRemoved.addListener((windowId) => {
      if (extensionWindow && extensionWindow.id === windowId) {
        extensionWindow = null;
      }
    });

  } catch (error) {
    console.error('Error opening extension window:', error);
  }
});

// Clean up when extension is disabled/unloaded
chrome.runtime.onSuspend.addListener(() => {
  if (extensionWindow) {
    chrome.windows.remove(extensionWindow.id);
    extensionWindow = null;
  }
}); 