import { PERSONAL_INFO, GITHUB_USER } from "../config";
import {
  simplifyRepo,
  fetchGitHubData,
  fetchReadme,
  suggestSimilarRepo,
} from "./githubService";
import {
  FunctionCall,
  GetAllReposOptions,
  GetAllReposResult,
  GetRepoDetailsOptions,
  SimplifiedRepo,
} from "./types";
import { limitedText } from "./utils";

async function getPersonalInfo() {
  return PERSONAL_INFO;
}

async function getAllRepos({
  sortBy = null,
  order = "desc",
  limit = 25,
  includeReadme = false,
}: GetAllReposOptions = {}): Promise<GetAllReposResult> {
  const data = await fetchGitHubData(`users/${GITHUB_USER}/repos`);
  let repos: SimplifiedRepo[] = data.map(simplifyRepo);

  const keyMap = {
    stars: "stargazers_count",
    forks: "forks_count",
    updated: "pushed_at",
    created: "created_at",
  };

  if (sortBy && sortBy.toLowerCase() in keyMap) {
    const key = keyMap[sortBy.toLowerCase() as keyof typeof keyMap];

    repos.sort((a, b) => {
      const aVal = a[key as keyof SimplifiedRepo]
        ? new Date(a[key as keyof SimplifiedRepo] as string).getTime()
        : 0;
      const bVal = b[key as keyof SimplifiedRepo]
        ? new Date(b[key as keyof SimplifiedRepo] as string).getTime()
        : 0;
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  if (limit && repos.length > limit) {
    repos = repos.slice(0, limit);
  }

  let notice: string | undefined;
  if (data.length > limit) {
    notice = `⚠️ There are more but Showing ${limit} of ${data.length} repositories.`;
  }

  if (includeReadme && GITHUB_USER) {
    for (const repo of repos) {
      const raw = await fetchReadme(
        GITHUB_USER,
        repo.name,
        repo.default_branch
      );
      if (raw) repo.readme = limitedText(raw);
    }
  }

  return { repos, notice };
}

async function getRepoDetails({
  repoName,
  includeReadme = false,
}: GetRepoDetailsOptions) {
  try {
    const repo = await fetchGitHubData(`repos/${GITHUB_USER}/${repoName}`);
    const simplified = simplifyRepo(repo);

    if (includeReadme && GITHUB_USER) {
      let raw = await fetchReadme(GITHUB_USER, repoName, repo.default_branch);
      if (raw) {
        simplified.readme = limitedText(raw);
      }
    }

    return simplified;
  } catch (error) {
    if (
      GITHUB_USER &&
      error instanceof Error &&
      error.message.includes("not found")
    ) {
      return await suggestSimilarRepo(repoName, GITHUB_USER);
    }
    throw error;
  }
}

export async function executeFunction(functionCall: FunctionCall) {
  switch (functionCall.name) {
    case "getPersonalInfo":
      return await getPersonalInfo();

    case "getAllRepos":
      return await getAllRepos(functionCall.args || {});

    case "getRepoDetails":
      return await getRepoDetails(functionCall.args);

    default:
      throw new Error(`Unknown function: ${(functionCall as any).name}`);
  }
}
