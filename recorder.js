let actions = [];
let currentInputGroup = null;
let modelId;
let currentUrl;

function startRecording() {
    if (!localStorage.getItem('modelId')) {
        modelId = generateUUID();
        localStorage.setItem('modelId', modelId);
        currentUrl = window.location.href;
        localStorage.setItem('currentUrl', currentUrl);
    } else {
        modelId = localStorage.getItem('modelId');
    }
    localStorage.setItem('recording', 'true');
    actions = JSON.parse(localStorage.getItem('actions') || '[]');
    currentInputGroup = null;
    console.log("Recording started. Model ID:", modelId);
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
    localStorage.removeItem('modelId');
    console.log('Recording ended. Model ID was:', modelId);
    modelId = null;
    showButtons('startRecording');
}

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

document.addEventListener('click', function(e) {
    if (localStorage.getItem('recording') === 'true') {
        if (e.target.closest('[data-recorder-ui]')) {
            return;
        }
        finalizeCurrentInputGroup();
        const selector = getUniqueSelector(e.target);
        addAction({
            actionType: 'CLICK',
            selector: selector,
            value: "",
            event: JSON.stringify(e)
        });
    }
});

document.addEventListener('input', function(e) {
    if (localStorage.getItem('recording') === 'true') {
        const selector = getUniqueSelector(e.target);
        const currentValue = e.target.value;

        if (!currentInputGroup || currentInputGroup.selector.selector !== selector.selector) {
            finalizeCurrentInputGroup();
            currentInputGroup = {
                actionType: 'INPUT',
                selector: selector,
                value: currentValue,
                event: JSON.stringify(e)
            };
        } else {
            currentInputGroup.value = currentValue;
        }
    }
});