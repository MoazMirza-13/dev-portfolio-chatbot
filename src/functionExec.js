import { PERSONAL_INFO, GITHUB_USER } from "../config.js";
import {
  simplifyRepo,
  fetchGitHubData,
  fetchReadme,
  suggestSimilarRepo,
} from "./githubService.js";
import { limitedText } from "./utils.js";

async function getPersonalInfo() {
  return PERSONAL_INFO;
}

async function getAllRepos({
  sortBy,
  order = "desc",
  limit = 25,
  includeReadme,
} = {}) {
  const data = await fetchGitHubData(`users/${GITHUB_USER}/repos`);
  let repos = data.map(simplifyRepo);

  if (sortBy) {
    const keyMap = {
      stars: "stargazers_count",
      forks: "forks_count",
      updated: "pushed_at",
      created: "created_at",
    };

    const key = keyMap[sortBy.toLowerCase()];
    if (key) {
      repos.sort((a, b) => {
        const aVal = new Date(a[key]) || a[key];
        const bVal = new Date(b[key]) || b[key];
        return order === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
  }

  if (limit && repos.length > limit) {
    repos = repos.slice(0, limit);
  }

  // Add a notice if too many
  if (data.length > limit) {
    repos.push({
      note: `⚠️ There are more but Showing ${limit} of ${data.length} repositories.`,
    });
  }

  // 🔹 add readme if requested
  if (includeReadme) {
    for (const repo of repos) {
      let raw = await fetchReadme(GITHUB_USER, repoName, repo.default_branch);
      repo.readme = limitedText(raw);
    }
  }

  return repos;
}

async function getRepoDetails({ repoName, includeReadme } = {}) {
  try {
    const repo = await fetchGitHubData(`repos/${GITHUB_USER}/${repoName}`);
    const simplified = simplifyRepo(repo);

    if (includeReadme) {
      let raw = await fetchReadme(GITHUB_USER, repoName, repo.default_branch);
      simplified.readme = limitedText(raw);
    }

    return simplified;
  } catch (error) {
    if (error.message.includes("not found")) {
      return await suggestSimilarRepo(repoName, GITHUB_USER);
    }
    throw error;
  }
}

export async function executeFunction(functionCall) {
  const { name, args } = functionCall;

  switch (name) {
    case "getPersonalInfo":
      return await getPersonalInfo();
    case "getAllRepos":
      return await getAllRepos(args || {});
    case "getRepoDetails":
      return await getRepoDetails(args || {});
    default:
      throw new Error(`Unknown function: ${name}`);
  }
}
