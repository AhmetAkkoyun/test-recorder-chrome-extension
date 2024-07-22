window.addEventListener('load', function() {
  if (localStorage.getItem('recording') === 'true') {
    createPanel();
    panel.style.display = 'block';
    showButtons('pauseRecording', 'stopRecording');
  }
  let newPageUrl = window.location.href;
  if (localStorage.getItem('currentUrl') !== newPageUrl) {
    localStorage.setItem('currentUrl', newPageUrl)
  }
  if (localStorage.getItem('modelId') !== null) {
    modelId = localStorage.getItem('modelId');
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "togglePanel") {
    if (!panel) {
      createPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});