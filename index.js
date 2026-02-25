const promptElem = document.querySelector('textarea[id="prompt"]');
const button = document.querySelector('button[id="button"]');
const textArea = document.querySelector('textarea[id="output"]');

async function getModels() {
    const url = 'http://localhost:1234/api/v1/models';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const result = await response.json();
        renderModels(result.models);

        const models = result.data ?? result.models ?? Object.values(result) ?? [];
        renderModels(models);
    }
    catch (error) {
        console.log(error.message);
    }
}

let selectedModel = '';

function renderModels(models) {
    const container = document.getElementById('models-container');
    container.innerHTML = '';

    if (!models || models.length === 0) {
        container.innerHTML = '<p>Nenhum modelo encontrado.</p>';
        return;
    }

    const select = document.createElement('select');
    select.id = 'models-select';

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.key;
        option.textContent = model.key;
        select.appendChild(option);
    });

    selectedModel = select.options[0].value;

    select.addEventListener('change', (e) => {
        selectedModel = e.target.value;
    });

    container.appendChild(select);
}

document.addEventListener('DOMContentLoaded', () => {
    getModels();
});


button.addEventListener('click', async () => {
    if (!promptElem) {
        console.error("Input element with id 'prompt' not found.");
        return;
    }

    const inputValue = promptElem.value;

    try {
        const response = await fetch("http://localhost:1234/v1/chat/completions", {
            method: "POST",
            headers: {
                //"Authorization": "Bearer lm-studio",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    { role: "user", content: inputValue }
                ]
            })
        });

        if (!response.ok) {
            console.error(`Request failed with status ${response.status}`);
            return;
        }

        const data = await response.json();
        textArea.value = data.choices[0].message.content;
    } catch (error) {
        console.error('Error during fetch operation:', error);
    }
});



