let recording = false;
let actions = [];
let currentInputGroup = null;
let recordId;

// UUID oluşturma fonksiyonu
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startRecording") {
    if (localStorage.getItem('recordId') === null) {
      recordId = generateUUID();
      localStorage.setItem('recordId', recordId);
      console.log("Oluşan recordId: " + recordId);
    } else {
      recordId = localStorage.getItem('recordId');
    }
    recording = true;
    actions = [];
    currentInputGroup = null;
    console.log("Recording started");

  } else if (request.action === "stopRecording") {
    console.log('durmadan hemen önce recordID = ' + localStorage.getItem('recordId'));
    recording = false;
    finalizeCurrentInputGroup();
    console.log("Recording stopped", actions);
    sendActionsToServer(actions);
    localStorage.clear();
    console.log('recordId = ' + recordId);
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
    saveActionsToLocalStorage(actions);
  }
});

document.addEventListener('DOMContentLoaded', function(e) {
  if (recording) {
    console.log(e);
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
    saveActionsToLocalStorage(actions);
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

// LOCALSTORAGE
function saveActionsToLocalStorage(actions) {
  actions.forEach(action => {
    if (action.selector && action.value !== null) {
      localStorage.setItem(action.selector, JSON.stringify(action));
    }
  });
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
