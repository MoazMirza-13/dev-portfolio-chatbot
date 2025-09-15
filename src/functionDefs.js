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
    "Get all GitHub repositories for the user (recent projects, languages used, etc).",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

export const getRepoDetailsDeclaration = {
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

export const functionDeclarations = [
  getPersonalInfoDeclaration,
  getAllReposDeclaration,
  getRepoDetailsDeclaration,
];
