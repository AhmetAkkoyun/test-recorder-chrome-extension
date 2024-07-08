let recording = false;
let actions = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startRecording") {
    recording = true;
    actions = [];
    console.log("Recording started");
  } else if (request.action === "stopRecording") {
    recording = false;
    console.log("Recording stopped", actions);
    sendActionsToServer(actions);
  }
});

document.addEventListener('click', function(e) {
  if (recording) {
    actions.push({
      type: 'click',
      selector: getCssSelector(e.target),
      text: e.target.textContent,
      e,
    });
  }
});

document.addEventListener('input', function(e) {
  if (recording) {
    actions.push({
      type: 'input',
      selector: getCssSelector(e.target),
      value: e.target.value
    });
  }
});

function getCssSelector(element) {
  if (element.id) return '#' + element.id;
  if (element.className) return '.' + element.className.split(' ').join('.');
  return element.tagName.toLowerCase();
}

function sendActionsToServer(actions) {
  fetch('http://localhost:8080/api/test-scenarios/record', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'chrome-extension://<ekogbfpfabeaacciefigammcaddfjkah>'
    },
    body: JSON.stringify(actions),
  })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
}
