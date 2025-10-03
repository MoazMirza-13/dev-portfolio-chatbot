import { Type } from "@google/genai";

export const getPersonalInfoDeclaration = {
  name: "getPersonalInfo",
  description:
    "Get personal information about the developer (bio, skills, experience, education, etc).",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

export const getAllReposDeclaration = {
  name: "getAllRepos",
  description:
    "Get all GitHub repositories for the user. Always use this function when the question is about programming languages, tech stack, or tools used in projects. Supports filtering and sorting (e.g., latest, most stars, most forks). And optionally including README content. If asked about 'famous' or 'best' then sort according to 'stars' and 'forks'.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sortBy: {
        type: Type.STRING,
        description:
          "Sort criterion: 'stars', 'forks', 'updated', 'created'. Defaults to none.",
      },
      order: {
        type: Type.STRING,
        description: "Sort order: 'asc' or 'desc'. Defaults to 'desc'.",
      },
      limit: {
        type: Type.NUMBER,
        description: "Maximum number of repositories to return.",
      },
      includeReadme: {
        type: Type.BOOLEAN,

        description: "Whether to include README content for each repo.",
      },
    },
    required: [],
  },
};

export const getRepoDetailsDeclaration = {
  name: "getRepoDetails",
  description:
    "Get detailed information about a specific repository including README content if requested.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      repoName: {
        type: Type.STRING,
        description: "The name of the repository to get details for",
      },
      includeReadme: {
        type: Type.BOOLEAN,

        description: "Whether to include README content for this repo.",
      },
    },
    required: ["repoName"],
  },
};

export const functionDeclarations = [
  getPersonalInfoDeclaration,
  getAllReposDeclaration,
  getRepoDetailsDeclaration,
];
