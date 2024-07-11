let panel;
let actions = [];
let currentInputGroup = null;
let recordId;
let currentUrl

function createPanel() {
  panel = document.createElement('div');
  panel.id = 'test-recorder-panel';
  panel.setAttribute('data-recorder-ui', 'true');
  panel.style.display = 'none';
  panel.innerHTML = `
    <button id="closePanel" data-recorder-ui="true" style="float: right;">—</button>
    <button id="startRecording" data-recorder-ui="true">Başlat</button>
    <button id="pauseRecording" data-recorder-ui="true" class="hidden">Duraklat</button>
    <button id="continueRecording" data-recorder-ui="true" class="hidden">Devam Et</button>
    <button id="stopRecording" data-recorder-ui="true" class="hidden">Durdur</button>
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
    currentUrl = window.location.href;
    localStorage.setItem('currentUrl', currentUrl);
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

  if (actions.length > 0) {
    sendActionsToServer(actions);
  } else {
    console.log("No actions to send");
  }

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
    if (e.target.closest('[data-recorder-ui]')) {
      return;
    }
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


window.addEventListener('load', function() {
  if (localStorage.getItem('recording') === 'true') {
    createPanel();
    panel.style.display = 'block';
    showButtons('pauseRecording', 'stopRecording');
  }
  let newPageUrl = window.location.href;
  if (localStorage.getItem(currentUrl) !== newPageUrl) {
    localStorage.setItem('currentUrl', newPageUrl)
  }
  if (localStorage.getItem(recordId) !== null) {
    recordId = localStorage.getItem('recordId');
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
  // ID varsa, onu kullan
  if (element.id) {
    return '#' + CSS.escape(element.id);
  }

  // ID yoksa, XPath oluştur
  let path = '';
  while (element !== document.body) {
    if (!element.parentNode) {
      break;
    }

    let idx = Array.from(element.parentNode.children)
        .filter(e => e.tagName === element.tagName)
        .indexOf(element) + 1;

    idx > 1 ? (path = `/${element.tagName.toLowerCase()}[${idx}]${path}`)
        : (path = `/${element.tagName.toLowerCase()}${path}`);

    element = element.parentNode;
  }

  return `xpath=/html${path}`;
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "togglePanel") {
    if (!panel) {
      createPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});



function sendActionsToServer(actions) {
  const payload = {
    recordId: recordId,
    actions: actions
  };

  console.log('Sending payload:', payload);  // Gönderilen veriyi loglayın

  fetch('http://localhost:8080/api/test-scenarios/record?recordId=' + recordId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actions)
  })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => console.log('Success:', data))
      .catch((error) => {
        console.error('Error:', error);
        console.error('Error details:', error.message);
      });
}