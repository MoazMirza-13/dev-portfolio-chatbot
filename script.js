import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Check if the API key is set
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please add it to your .env file.");
  process.exit(1);
}

// Initialize the Google Generative AI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define the name of the model you want to use
const MODEL_NAME = "gemini-2.5-flash-lite";

// static prompt
const prompt = "a story about an idiot in one line";

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const generatedText = response.candidates[0].content.parts[0].text;
    console.log("🚀 ~ run ~ generatedText:", generatedText);
  } catch (error) {
    console.error("An error occurred while connecting to Gemini:", error);
  }
}

run();
