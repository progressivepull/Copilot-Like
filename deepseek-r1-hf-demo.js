// Install dependencies: npm install @huggingface/inference gradio-lite
// Note: DeepSeek-R1 is a PyTorch model, not natively runnable in browsers/Node.js. 
// This example uses Hugging Face Inference API for model inference.

const HF_API_TOKEN = ""; // Set your Hugging Face API token here
const MODEL_ID = "deepseek-ai/deepseek-llm-r-1.3b-base";

async function deepseekGenerate(prompt) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
        },
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Hugging Face API Error: " + response.statusText);
  }
  const data = await response.json();
  // API returns array of generated texts
  if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
    return data[0].generated_text.substring(prompt.length); // Remove input prompt
  }
  // For some models, the result is in .generated_text
  if (data.generated_text) {
    return data.generated_text.substring(prompt.length);
  }
  return "No output";
}

$( document ).ready(function() {
  document.getElementById("submit").onclick = async () => {
  const prompt = document.getElementById("prompt").value;
  document.getElementById("output").textContent = "Loading...";
  document.getElementById("error").textContent = "";
  try {
    const output = await deepseekGenerate(prompt);
    document.getElementById("output").textContent = output.trim();
  } catch (err) {
    document.getElementById("error").textContent = err.message;
    document.getElementById("output").textContent = "";
  }
};
});

