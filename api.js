function sendActionsToServer(actions) {
    const modelId = localStorage.getItem('modelId');
    fetch(`http://localhost:9090/test-model/${modelId}/scenarios`, {
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