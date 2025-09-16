import { PERSONAL_INFO, GITHUB_USER } from "../config.js";
import { simplifyRepo, fetchGitHubData, fetchReadme } from "./githubService.js";

async function getPersonalInfo() {
  return PERSONAL_INFO;
}

async function getAllRepos({
  sortBy,
  order = "desc",
  limit,
  includeReadme,
} = {}) {
  const data = await fetchGitHubData(`users/${GITHUB_USER}/repos`);
  let repos = data.map(simplifyRepo);

  if (sortBy) {
    const keyMap = {
      stars: "stargazers_count",
      forks: "forks_count",
      updated: "updated_at",
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

  if (limit) repos = repos.slice(0, limit);

  // 🔹 add readme if requested
  if (includeReadme) {
    for (const repo of repos) {
      repo.readme = await fetchReadme(GITHUB_USER, repo.name);
    }
  }

  return repos;
}

async function getRepoDetails({ repoName, includeReadme } = {}) {
  const repo = await fetchGitHubData(`repos/${GITHUB_USER}/${repoName}`);
  const simplified = simplifyRepo(repo);

  if (includeReadme) {
    simplified.readme = await fetchReadme(GITHUB_USER, repoName);
  }

  return simplified;
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
