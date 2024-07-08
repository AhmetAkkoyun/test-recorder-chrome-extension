let recording = false;
let actions = [];
let currentInputGroup = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startRecording") {
    recording = true;
    actions = [];
    currentInputGroup = null;
    console.log("Recording started");
  } else if (request.action === "stopRecording") {
    recording = false;
    finalizeCurrentInputGroup();
    console.log("Recording stopped", actions);
    sendActionsToServer(actions);
  }
});

document.addEventListener('click', function(e) {
  if (recording) {
    finalizeCurrentInputGroup();
    const selector = getUniqueSelector(e.target);
    const coordinates = `(${e.clientX},${e.clientY})`;
    actions.push({
      type: 'click',
      selector: `${selector}${coordinates}`,
      text: e.target.textContent.trim(),
    });
  }
});

document.addEventListener('input', function(e) {
  if (recording) {
    const selector = getUniqueSelector(e.target);
    const currentValue = e.target.value;

    if (!currentInputGroup || currentInputGroup.selector !== selector) {
      finalizeCurrentInputGroup();
      currentInputGroup = {
        type: 'input',
        selector: selector,
        value: currentValue
      };
    } else {
      currentInputGroup.value = currentValue;
    }
  }
});

function finalizeCurrentInputGroup() {
  if (currentInputGroup) {
    actions.push(currentInputGroup);
    currentInputGroup = null;
  }
}

function getUniqueSelector(element) {
  if (element.id) return '#' + element.id;
  if (element.name) return element.tagName.toLowerCase() + '[name="' + element.name + '"]';

  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
    if (element.placeholder) return `${element.tagName.toLowerCase()}[placeholder="${element.placeholder}"]`;
    if (element.type) return `${element.tagName.toLowerCase()}[type="${element.type}"]`;
  }

  const labels = element.labels;
  if (labels && labels.length > 0) {
    return `${element.tagName.toLowerCase()}[aria-label="${labels[0].textContent.trim()}"]`;
  }

  const classes = Array.from(element.classList).filter(c => !c.startsWith('ng-'));
  if (classes.length) return '.' + classes.join('.');

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