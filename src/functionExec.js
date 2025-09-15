import { PERSONAL_INFO, GITHUB_USER } from "../config.js";
import { simplifyRepo, fetchGitHubData, fetchReadme } from "./githubService.js";

async function getPersonalInfo() {
  return PERSONAL_INFO;
}

async function getAllRepos() {
  const data = await fetchGitHubData(`users/${GITHUB_USER}/repos`);
  return data.map(simplifyRepo);
}

async function getRepoDetails(repoName) {
  const repo = await fetchGitHubData(`repos/${GITHUB_USER}/${repoName}`);
  const simplified = simplifyRepo(repo);
  simplified.readme = await fetchReadme(GITHUB_USER, repoName);
  return simplified;
}

export async function executeFunction(functionCall) {
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
