import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USER = process.env.GITHUB_USERNAME;

if (!API_KEY || !GITHUB_USER) {
  console.error("Missing GEMINI_API_KEY or GITHUB_USERNAME in .env file.");
  process.exit(1);
}

// Initialize the Google Generative AI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// model
const MODEL_NAME = "gemini-2.5-flash-lite";

const firstStaticPrompt = `You are an API endpoint generator. Always respond ONLY with raw JSON (no code fences, no explanation).
Use the variable ${GITHUB_USER} instead of hardcoding my username.
Return in the format: { "github_api_endpoint": "..." }`;

// static prompt
const user_prompt = " Give me your 4 recent project you’re working on";

const firstContent = firstStaticPrompt + "\n\n" + user_prompt;

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: firstContent,
    });

    // get the endpoint using the first call
    const generatedText = response.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(generatedText);
    const endpoint = parsed.github_api_endpoint;

    console.log("🚀 ~ run ~ endpoint:", endpoint);
  } catch (error) {
    console.error("An error occurred while connecting to Gemini:", error);
  }
}

run();
