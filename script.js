import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  simplifyRepo,
  fetchGitHubData,
  fetchReadme,
  cleanAIResponse,
} from "./utils.js";

// Load environment variables
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USER = process.env.GITHUB_USERNAME;

if (!API_KEY || !GITHUB_USER) {
  console.error("❌ Missing GEMINI_API_KEY or GITHUB_USERNAME in .env file.");
  process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: API_KEY });
const MODEL_NAME = "gemini-2.5-flash-lite";

// Dummy personal info
const PERSONAL_INFO = {
  name: "Moaz",
  title: "Full Stack Developer",
  experience: "2 years",
  location: "Narowal",
  skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
  education: "Bs psychologist",
  contact: "blahblah.com",
  bio: "Passionate developer who loves to do side projects",
  interests: ["Web Development", "killing humans :)", "Open Source"],
  git_username: GITHUB_USER,
};

// Instruction prompt for first call
const instructionPrompt = `You are an API task planner.
Always respond ONLY with raw JSON (NO EXPLANATIONS, NO CODE FENCES).
Decide the correct action based on the user query.

Actions:
- "info": if the question is about personal info (bio, skills, experience, etc).
- "github_api": if the question needs all repos (languages, recent projects, etc).
- "repo_details": if the question is about one specific repo (description, README, etc).
- "error": if the request cannot be understood or is invalid.

Rules:
- You can return more than one endpoint if needed.
- If action is "info", set "github_api_endpoints": [].
- If action is "error", set "github_api_endpoints": [] and explain in "reason".

Github Username:
- ${GITHUB_USER}

Format strictly like this:
{
  "action": "info | github_api | repo_details | error",
  "github_api_endpoints": ["endpoint1", "endpoint2"],
  "reason": "short explanation"
}`;

// Example user input
const user_prompt = "give me your github profile url and 6 recent projects";

async function run() {
  try {
    // First Gemini call
    const firstPrompt = instructionPrompt + "\n\n User asked: " + user_prompt;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: firstPrompt,
    });

    const rawText = response.text;
    const cleanedText = cleanAIResponse(rawText);
    const parsed = JSON.parse(cleanedText);
    const action = parsed.action;
    const endpoints = parsed.github_api_endpoints || [];
    const reason = parsed.reason;

    console.log("🚀 ~ First Gemini decision:", parsed);

    // Handle error action
    if (action === "error") {
      const dynamicErrorPrompt = `
You are a helpful assistant. The user asked something outside scope:
"${reason}"

Generate a friendly, natural fallback response telling them you can only answer about ${GITHUB_USER}'s skills, projects, or experience. Suggest what they can ask instead.
`;

      const fallbackAnswer = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: dynamicErrorPrompt,
      });
      console.log("✅ Final error Action answer:", fallbackAnswer.text);
      return;
    }

    // Handle personal info
    if (action === "info") {
      const infoPrompt = `The user asked: ${user_prompt}
Here is my stored personal info: ${JSON.stringify(PERSONAL_INFO, null, 2)}
Answer naturally using this info.`;

      const infoResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: infoPrompt,
      });
      console.log("✅ Final Answer:", infoResponse.text);
      return;
    }

    // Handle GitHub-related actions
    let allData = [];
    for (const endpoint of endpoints) {
      try {
        const data = await fetchGitHubData(endpoint);
        // Repo or repo list
        if (Array.isArray(data)) {
          allData.push(...data.map((repo) => simplifyRepo(repo)));
        } else {
          const simplified = simplifyRepo(data);
          // Add README if repo_details
          if (action === "repo_details") {
            simplified.readme = await fetchReadme(GITHUB_USER, simplified.name);
          }
          allData.push(simplified);
        }
      } catch (err) {
        console.log(`❌ Failed fetching ${endpoint}:`, err.message);
      }
    }

    if (!allData.length) {
      console.log("⚠️ No data returned from GitHub.");
      return;
    }

    // Second Gemini call
    const secondPrompt = `The user asked: ${user_prompt}
Here is the relevant data: ${JSON.stringify(allData, null, 2)}
Answer the user's question in natural language using only this data. And provide URLs if possible`;

    const secondResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: secondPrompt,
    });

    console.log("✅ Final Answer:", secondResponse.text);
  } catch (error) {
    console.error("❌ Fatal Error:", error.message);
  }
}

run();
