import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { simplifyRepo, fetchGitHubData, fetchReadme } from "./utils.js";

// Load environment variables
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USER = process.env.GITHUB_USERNAME;

if (!API_KEY || !GITHUB_USER) {
  console.error("❌ Missing GEMINI_API_KEY or GITHUB_USERNAME in .env file.");
  process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenAI(API_KEY);
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

// Function declarations following the official Google format
const getPersonalInfoDeclaration = {
  name: "getPersonalInfo",
  description:
    "Get personal information about the developer including bio, skills, experience, education, etc.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

const getAllReposDeclaration = {
  name: "getAllRepos",
  description:
    "Get all GitHub repositories for the user to show recent projects, languages used, etc.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

const getRepoDetailsDeclaration = {
  name: "getRepoDetails",
  description:
    "Get detailed information about a specific repository including README content.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      repoName: {
        type: Type.STRING,
        description: "The name of the repository to get details for",
      },
    },
    required: ["repoName"],
  },
};

// Function implementations
async function getPersonalInfo() {
  return PERSONAL_INFO;
}

async function getAllRepos() {
  try {
    const data = await fetchGitHubData(`users/${GITHUB_USER}/repos`);
    return data.map((repo) => simplifyRepo(repo));
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
}

async function getRepoDetails(repoName) {
  try {
    const repo = await fetchGitHubData(`repos/${GITHUB_USER}/${repoName}`);
    const simplified = simplifyRepo(repo);
    simplified.readme = await fetchReadme(GITHUB_USER, repoName);
    return simplified;
  } catch (error) {
    throw new Error(`Failed to fetch repository details: ${error.message}`);
  }
}

// Function dispatcher
async function executeFunction(functionCall) {
  const { name, args } = functionCall;

  switch (name) {
    case "getPersonalInfo":
      return await getPersonalInfo();
    case "getAllRepos":
      return await getAllRepos();
    case "getRepoDetails":
      return await getRepoDetails(args.repoName);
    default:
      throw new Error(`Unknown function: ${name}`);
  }
}

// Example user input
const user_prompt = "in which project you made the recent updates";

async function run() {
  try {
    // Generation config with function declarations
    const config = {
      tools: [
        {
          functionDeclarations: [
            getPersonalInfoDeclaration,
            getAllReposDeclaration,
            getRepoDetailsDeclaration,
          ],
        },
      ],
    };

    // Initial user message with system context
    const systemMessage = `You are a helpful assistant that can answer questions about ${GITHUB_USER}'s professional background, skills, and GitHub projects.

You have access to these functions:
- getPersonalInfo: For questions about personal info, bio, skills, experience, education, etc.
- getAllRepos: For questions about all repositories, recent projects, languages used, etc.
- getRepoDetails: For questions about a specific repository by name.

Always provide natural, conversational responses. Include URLs when available.

If a question is outside your scope, politely explain that you can only help with questions about their skills, projects, or experience.`;

    let contents = [
      {
        role: "user",
        parts: [{ text: `${systemMessage}\n\nUser question: ${user_prompt}` }],
      },
    ];

    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: config,
    });

    // Check if the model wants to call functions
    if (response.functionCalls && response.functionCalls.length > 0) {
      console.log("🔧 Function calls detected:", response.functionCalls);

      // Execute each function call
      for (const functionCall of response.functionCalls) {
        try {
          console.log(`🔧 Executing ${functionCall.name}...`);

          // Execute the function
          const result = await executeFunction(functionCall);
          console.log(`✅ ${functionCall.name} executed successfully`);

          // Create function response part
          const functionResponsePart = {
            name: functionCall.name,
            response: { result },
          };

          // Append function call and result to contents
          contents.push(response.candidates[0].content);
          contents.push({
            role: "user",
            parts: [{ functionResponse: functionResponsePart }],
          });
        } catch (error) {
          console.log(`❌ ${functionCall.name} failed:`, error.message);

          // Add error response
          const errorResponsePart = {
            name: functionCall.name,
            response: { error: error.message },
          };

          contents.push(response.candidates[0].content);
          contents.push({
            role: "user",
            parts: [{ functionResponse: errorResponsePart }],
          });
        }
      }

      // Get the final response from the model
      const finalResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: contents,
        config: config,
      });

      console.log("✅ Final Answer:", finalResponse.text);
    } else {
      // No function calls needed, return direct response
      console.log("✅ Final Answer:", response.text);
    }
  } catch (error) {
    console.error("❌ Fatal Error:", error);

    // Fallback response similar to your original approach
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `The user asked: "${user_prompt}"\n\nGenerate a friendly response explaining that you can only answer questions about ${GITHUB_USER}'s skills, projects, or experience. Suggest what they can ask instead.`,
              },
            ],
          },
        ],
      });
      console.log("✅ Fallback Answer:", fallbackResponse.text);
    } catch (fallbackError) {
      console.log(
        `✅ Fallback Answer: I'm sorry, I can only help with questions about ${GITHUB_USER}'s skills, projects, or experience. Try asking about skills, recent projects, or specific repositories!`
      );
    }
  }
}

run();
