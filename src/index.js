import { GoogleGenAI } from "@google/genai";
import { API_KEY, MODEL_NAME, GITHUB_USER } from "../config.js";
import { functionDeclarations } from "./functionDefs.js";
import { executeFunction } from "./functionExec.js";
import { extractText, safeGenerateContent } from "./utils.js";

const ai = new GoogleGenAI(API_KEY);

export async function handleUserQuery(userPrompt) {
  try {
    const systemMessage = `You are a helpful assistant that can answer questions about ${GITHUB_USER}'s professional background, skills, and GitHub projects.

You have access to these functions:
- getPersonalInfo: For questions about personal info, bio, skills, experience, education, etc.
- getAllRepos: For questions about all repositories, recent projects, languages used, etc.
- getRepoDetails: For questions about a specific repository by name.

Always provide natural, conversational responses. Include URLs when available.
If a question is outside your scope, politely explain that you can only help with ${GITHUB_USER}'s skills, projects, or experience.`;

    let contents = [
      {
        role: "user",
        parts: [{ text: `${systemMessage}\n\nUser question: ${userPrompt}` }],
      },
    ];

    const config = { tools: [{ functionDeclarations }] };

    // Step 1: Ask AI
    const response = await safeGenerateContent(ai, {
      model: MODEL_NAME,
      contents,
      config,
    });

    // Step 2: Handle function calls
    if (response.functionCalls?.length) {
      for (const functionCall of response.functionCalls) {
        try {
          const result = await executeFunction(functionCall);

          contents.push(response.candidates[0].content);
          contents.push({
            role: "user",
            parts: [
              {
                text: `Here is the raw data returned from function "${functionCall.name}". 
Summarize and explain technologies used, and key features it in a helpful, conversational way for a non-technical person.`,
              },
              {
                functionResponse: {
                  name: functionCall.name,
                  response: { result },
                },
              },
            ],
          });
        } catch (err) {
          contents.push(response.candidates[0].content);
          contents.push({
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: functionCall.name,
                  response: { error: err.message },
                },
              },
            ],
          });
        }
      }

      // Step 3: Final AI response
      const finalResponse = await safeGenerateContent(ai, {
        model: MODEL_NAME,
        contents,
        config,
      });

      // 🟢 FIX: Check for text safely
      return extractText(finalResponse);
    }

    // No function calls → direct answer
    return extractText(response);
  } catch (error) {
    console.log("🚀 ~ handleUserQuery ~ error:", error);
    // Step 4: Fallback answer
    return `⚠️ Sorry, I couldn’t process that request right now. Try a different question or the model might get overloaded. Please try again later.`;
  }
}
