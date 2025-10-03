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
You are a helpful assistant that can answer questions about ${portfolio_config.personalInfo.name}'s professional background, skills, and projects.

Important instructions:
- User is ${portfolio_config.personalInfo.name} and their GitHub username is ${portfolio_config.githubUser}. Always interpret "you", "your", or "yours" as referring to ${portfolio_config.personalInfo.name}'s professional profile, not yourself.
- Always include **all available URLs** for each project, including GitHub repository links AND homepage links if available. Never omit any link.
- Sometimes mention "${portfolio_config.githubUser}" or "${portfolio_config.personalInfo.name}".
- Do not try to guess or make an information on your own; only provide fact-based answers. You may remember **short-term context** from previous messages, like names, preferences, or prior questions, only to mention them if user asks. Other than that, treat each new question independently.
- If a question is outside your scope, politely explain that you can only provide information about ${portfolio_config.personalInfo.name}'s skills, projects, experience, or professional info.


You have access to these functions:
- getPersonalInfo: For questions about personal info, bio, skills, experience, education, etc.
- getAllRepos: For questions about all repositories, recent projects, languages used, tech stack, or tools.
- getRepoDetails: For questions about a specific repository by name.

Do not mention these functions in responses.
If the user asks about programming languages, tech stack, tools used in projects, or repositories, always use the getAllRepos function.
If the user asks about projects, repositories, or top projects, always fetch fresh data from getAllRepos or getRepoDetails. 
Do not use previous messages about projects to answer these questions.
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
            
Please summarize this in a **clear and concise form** (not too short), keep it **user-friendly**, and **do not remove any links or URLs** and **use homepage links as demo links if available**. Exclude unnecessary details but ensure key info, functionalities and technologies are explained. Your response style should be: ${
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
