import { GoogleGenAI } from '@google/genai';

// Initialize the client with your key
const ai = new GoogleGenAI({ apiKey: '<YOUR_API_KEY>' });

async function listMyModels() {
  try {
    console.log("Fetching available models...\n");
    
    // Fetch the list of models
    const response = await ai.models.list();
    
    // The response is an async iterable, so we use for await
    for await (const model of response) {
      console.log(`Name: ${model.name}`); // The string you use in your code (e.g., 'gemini-2.5-flash')
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Description: ${model.description}`);
      console.log('-----------------------------------');
    }
    
  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

listMyModels();