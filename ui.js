let panel;

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