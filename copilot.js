const form = document.getElementById('copilot-form');
const promptInput = document.getElementById('prompt');
const suggestionBox = document.getElementById('suggestion');

// Replace with your own Hugging Face API token!
const HF_TOKEN = 'YOUR_HF_TOKEN'; // <-- INSERT YOUR TOKEN HERE

async function getCompletion(prompt) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/bigcode/starcoder",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 64,
          temperature: 0.2,
          stop: ["\n\n"] // Try to stop at end of logical block
        }
      })
    }
  );
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg);
  }
  const result = await response.json();
  if (Array.isArray(result) && result[0]?.generated_text) {
    // Some models return array of {generated_text}
    return result[0].generated_text.substring(prompt.length);
  } else if (result?.generated_text) {
    return result.generated_text.substring(prompt.length);
  }
  return "(No suggestion)";
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = promptInput.value;
  suggestionBox.textContent = "Loading...";
  try {
    const suggestion = await getCompletion(prompt);
    suggestionBox.textContent = suggestion.trim() || "(No suggestion)";
  } catch (err) {
    suggestionBox.textContent = "Error: " + err.message;
  }
});
