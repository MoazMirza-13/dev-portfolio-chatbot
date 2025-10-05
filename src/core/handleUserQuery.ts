import { GenerateContentResponse } from "@google/genai";
import { functionDeclarations } from "./functionDefs";
import { extractText, safeGenerateContent } from "./utils";
import { executeFunction } from "./functionExec";
import { Config } from "./types";

export async function handleUserQuery(
  userPrompt: string,
  portfolio_config: Config,
  history: { role: "user" | "model"; text: string }[] = []
) {
  const systemMessage = `
You are a helpful assistant about ${portfolio_config.personalInfo.name}'s professional background, skills, and projects.

Instructions:
- "You", "your" refers to ${portfolio_config.personalInfo.name}, not yourself. GitHub: ${portfolio_config.githubUser}.
- Include **all URLs** for each project (GitHub + homepage). Never omit links.
- Occasionally mention "${portfolio_config.githubUser}" or "${portfolio_config.personalInfo.name}".
- Only provide fact-based answers; don’t guess. Use history only for short-term context. Treat each question independently.
- If outside scope, politely say something like "I provide info about ${portfolio_config.personalInfo.name}'s background, skills, and projects" but in your own words.
- Do not repeat with some exact words from previous responses. Make every response like it's fresh.

Functions (do not mention):
- getPersonalInfo: personal info, bio, skills, experience, education.
- getAllRepos: all repos, recent projects, languages, tech stack, tools.
- getRepoDetails: details of a specific repo.

Always use getAllRepos/getRepoDetails for questions about repos, projects, or tech. Do not reuse previous answers about projects.
`;

  try {
    let contents = [
      ...history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];

    const config = {
      systemInstruction: systemMessage,
      tools: [{ functionDeclarations }],
      temperature: 0.7,
    };

    // Step 1: Ask AI
    const response = await safeGenerateContent(portfolio_config.apiUrl, {
      model: portfolio_config.model,
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
          const result = await executeFunction(functionCall, portfolio_config);

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
            
Please summarize this in a **clear and concise form** (not too short), keep it **user-friendly**, and **do not remove any links or URLs** and **use homepage links as demo links if available**, **using different phrasing than prior summaries**. Exclude unnecessary details but ensure key info, functionalities and technologies are explained. For word "repository", prefer saying "project". You may rephrase sentences and vary phrasing so responses feel fresh and dynamic. Your response style should be: ${
                  portfolio_config.tone
                }.`,
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
      const finalResponse = await safeGenerateContent(portfolio_config.apiUrl, {
        model: portfolio_config.model,
        contents,
        config: {
          systemInstruction: systemMessage,
          temperature: 0.7,
        },
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
