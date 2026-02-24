const promptElem = document.querySelector('textarea[id="prompt"]');
const button = document.querySelector('button[id="button"]');
const textArea = document.querySelector('textarea[id="output"]');

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
                model: "google/gemma-3-1b",
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


