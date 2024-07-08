document.getElementById('startRecording').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "startRecording"});
    });
  };
  
  document.getElementById('stopRecording').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "stopRecording"});
    });
  };