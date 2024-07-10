let panel;
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
  if (!localStorage.getItem('recordId')) {
    recordId = generateUUID();
    localStorage.setItem('recordId', recordId);
  } else {
    recordId = localStorage.getItem('recordId');
  }
  localStorage.setItem('recording', 'true');
  actions = JSON.parse(localStorage.getItem('actions') || '[]');
  currentInputGroup = null;
  console.log("Recording started");
  showButtons('pauseRecording', 'stopRecording');
}

function pauseRecording() {
  localStorage.setItem('recording', 'false');
  console.log("Recording paused");
  showButtons('continueRecording', 'stopRecording');
}

function continueRecording() {
  localStorage.setItem('recording', 'true');
  console.log("Recording continued");
  showButtons('pauseRecording', 'stopRecording');
}

function stopRecording() {
  localStorage.setItem('recording', 'false');
  finalizeCurrentInputGroup();
  actions = JSON.parse(localStorage.getItem('actions') || '[]');
  console.log("Recording stopped", actions);
  sendActionsToServer(actions);
  localStorage.removeItem('actions');
  localStorage.removeItem('recordId');
  console.log('recordId = ' + recordId);
  showButtons('startRecording');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

document.addEventListener('click', function(e) {
  if (localStorage.getItem('recording') === 'true') {
    finalizeCurrentInputGroup();
    const selector = getUniqueSelector(e.target);
    const coordinates = `(${e.clientX},${e.clientY})`;
    addAction({
      type: 'click',
      selector: `${selector}${coordinates}`,
      value: e.target.textContent.trim(),
    });
  }
});

document.addEventListener('input', function(e) {
  if (localStorage.getItem('recording') === 'true') {
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
    addAction(currentInputGroup);
    currentInputGroup = null;
  }
}

function addAction(action) {
  actions = JSON.parse(localStorage.getItem('actions') || '[]');
  actions.push(action);
  localStorage.setItem('actions', JSON.stringify(actions));
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "togglePanel") {
    if (!panel) {
      createPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});

// Sayfa yüklendiğinde kayıt durumunu kontrol et
window.addEventListener('load', function() {
  if (localStorage.getItem('recording') === 'true') {
    createPanel();
    panel.style.display = 'block';
    showButtons('pauseRecording', 'stopRecording');
  }
});