// currently, the function calling feature of gemini is not too good. So, using static prompts for strict instructions!

export const getInstructionPrompt = (githubUser) => `
You are an API task planner.
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
- ${githubUser}

Format strictly like this:
{
  "action": "info | github_api | repo_details | error",
  "github_api_endpoints": ["endpoint1", "endpoint2"],
  "reason": "short explanation"
}`;

export const getErrorPrompt = (reason, githubUser) => `
You are a helpful assistant. The user asked something outside scope:
"${reason}"

Generate a friendly, natural fallback response telling them they may have typed the repo name wrong. Suggest checking the spelling or asking about other repos from ${githubUser}.
`;

export const getInfoPrompt = (userPrompt, personalInfo) => `
The user asked: ${userPrompt}
Here is my stored personal info: ${JSON.stringify(personalInfo, null, 2)}
Answer naturally using this info.
`;

export const getSecondPrompt = (userPrompt, data) => `
The user asked: ${userPrompt}
Here is the relevant data: ${JSON.stringify(data, null, 2)}
Answer the user's question in natural language using only this data. And provide URLs if possible.
`;
