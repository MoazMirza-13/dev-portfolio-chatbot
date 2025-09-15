import { GoogleGenAI } from "@google/genai";
import { API_KEY, MODEL_NAME } from "../portfolio_config.js";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function askAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    throw new Error(`AI error: ${err.message}`);
  }
}
