import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import {
  API_KEY,
  MODEL_NAME,
  GITHUB_USER,
  MODEL_TONE,
  PERSONAL_INFO,
} from "../../config";
import { functionDeclarations } from "./functionDefs";
import { extractText, safeGenerateContent } from "./utils";
import { executeFunction } from "./functionExec";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function handleUserQuery(userPrompt: string) {
  try {
    const systemMessage = `You are a helpful assistant that can answer questions about ${GITHUB_USER}'s professional background, skills, and GitHub projects.

    Important instructions:
- Always interpret "you", "your", or "yours" as referring to ${GITHUB_USER}, not yourself.
- Every response should mention "${GITHUB_USER}" or "${PERSONAL_INFO.name}" explicitly at least once.
- Sometimes when possible, include a direct GitHub URL (e.g., https://github.com/${GITHUB_USER} or a repo link).
- Your response style should be: ${MODEL_TONE}.


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

    // Step 2: Handle function calls with proper null checking
    if (
      !response.candidates ||
      !response.candidates[0] ||
      !response.candidates[0].content
    ) {
      return `⚠️ Sorry, I couldn't get a proper response from the AI. Please try again.`;
    }

    const firstCandidate = response.candidates[0];
    const candidateContent = firstCandidate.content;

    const functionCalls =
      candidateContent?.parts
        ?.filter((part: any) => part.functionCall)
        .map((part: any) => part.functionCall) ?? [];

    if (functionCalls.length) {
      for (const functionCall of functionCalls) {
        try {
          const result = await executeFunction(functionCall);

          contents.push(
            candidateContent as { role: string; parts: { text: string }[] }
          );
          contents.push({
            role: "user",
            parts: [
              {
                text: `Function "${
                  functionCall.name
                }" returned data. Here is the raw data: ${JSON.stringify(
                  result,
                  null,
                  2
                )}
            
Please summarize and explain technologies used, and key features in a helpful, conversational way for a non-technical person.`,
              },
            ],
          });
        } catch (err) {
          contents.push(
            candidateContent as { role: string; parts: { text: string }[] }
          );
          contents.push({
            role: "function",
            parts: [
              {
                text: `Function "${functionCall.name}" returned an error: ${
                  (err as Error).message
                }`,
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

      return extractText(finalResponse as GenerateContentResponse);
    }

    // No function calls → direct answer
    return extractText(response as GenerateContentResponse);
  } catch (error) {
    // Fallback answer
    return `⚠️ Sorry, I couldn't process that request right now. Try a different question or the model might get overloaded. Please try again later.`;
  }
}
