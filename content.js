let panel;
let recording = false;
let actions = [];
let currentInputGroup = null;
let recordId;

function createPanel() {
  panel = document.createElement('div');
  panel.id = 'test-recorder-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <button id="closePanel" style="float: right;">—</button>
    <button id="startRecording">Başlat</button>
    <button id="pauseRecording" class="hidden">Duraklat</button>
    <button id="continueRecording" class="hidden">Devam Et</button>
    <button id="stopRecording" class="hidden">Durdur</button>
  `;
  document.body.appendChild(panel);


  document.getElementById('closePanel').addEventListener('click', () => panel.style.display = 'none');
  document.getElementById('startRecording').addEventListener('click', startRecording);
  document.getElementById('pauseRecording').addEventListener('click', pauseRecording);
  document.getElementById('continueRecording').addEventListener('click', continueRecording);
  document.getElementById('stopRecording').addEventListener('click', stopRecording);
}

function showButtons(...buttonsToShow) {
  ['startRecording', 'pauseRecording', 'continueRecording', 'stopRecording'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  buttonsToShow.forEach(id => {
    document.getElementById(id).classList.remove('hidden');
  });
}

function startRecording() {
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
  showButtons('pauseRecording', 'stopRecording');
}

function pauseRecording() {
  recording = false;
  console.log("Recording paused");
  showButtons('continueRecording', 'stopRecording');
}

function continueRecording() {
  recording = true;
  console.log("Recording continued");
  showButtons('pauseRecording', 'stopRecording');
}

function stopRecording() {
  recording = false;
  finalizeCurrentInputGroup();
  console.log("Recording stopped", actions);
  sendActionsToServer(actions);
  localStorage.clear();
  console.log('recordId = ' + recordId);
  showButtons('startRecording');
}

// UUID oluşturma fonksiyonu
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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

// Mesaj dinleyicisi
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "togglePanel") {
    if (!panel) {
      createPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});