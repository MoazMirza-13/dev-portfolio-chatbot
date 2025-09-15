import { GITHUB_USER, PERSONAL_INFO } from "../portfolio_config.js";
import { askAI } from "./aiService.js";
import { cleanAIResponse } from "./utils.js";
import { simplifyRepo, fetchGitHubData, fetchReadme } from "./githubService.js";
import {
  getInstructionPrompt,
  getErrorPrompt,
  getInfoPrompt,
  getSecondPrompt,
} from "./prompts.js";

export async function handleUserQuery(userPrompt) {
  try {
    // First AI decision
    const instructionPrompt = getInstructionPrompt(GITHUB_USER);
    const response = await askAI(
      instructionPrompt + "\n\n User asked: " + userPrompt
    );

    const parsed = JSON.parse(cleanAIResponse(response));
    const { action, github_api_endpoints: endpoints = [], reason } = parsed;

    if (action === "error") {
      return await askAI(getErrorPrompt(reason, GITHUB_USER));
    }

    if (action === "info") {
      return await askAI(getInfoPrompt(userPrompt, PERSONAL_INFO));
    }

    // GitHub actions
    let allData = [];
    let fetchError = null;

    for (const endpoint of endpoints) {
      try {
        const data = await fetchGitHubData(endpoint);
        if (Array.isArray(data)) {
          allData.push(...data.map(simplifyRepo));
        } else {
          const simplified = simplifyRepo(data);
          if (action === "repo_details") {
            simplified.readme = await fetchReadme(GITHUB_USER, simplified.name);
          }
          allData.push(simplified);
        }
      } catch (err) {
        fetchError = err.message;
      }
    }

    if (!allData.length) {
      return await askAI(getErrorPrompt(fetchError || reason, GITHUB_USER));
    }

    // Second AI response
    return await askAI(getSecondPrompt(userPrompt, allData));
  } catch (err) {
    return `❌ Fatal Error: ${err.message}`;
  }
}
