import {
  simplifyRepo,
  fetchGitHubData,
  fetchReadme,
  suggestSimilarRepo,
} from "./githubService";
import {
  Config,
  FunctionCall,
  GetAllReposOptions,
  GetAllReposResult,
  GetRepoDetailsOptions,
  SimplifiedRepo,
} from "./types";
import { limitedText } from "./utils";

async function getPersonalInfo(personalInfo: Config["personalInfo"]) {
  return personalInfo;
}

async function getAllRepos(
  portfolio_config: Config,
  {
    sortBy = null,
    order = "desc",
    limit = 25,
    includeReadme = false,
  }: GetAllReposOptions = {}
): Promise<GetAllReposResult> {
  const data = await fetchGitHubData(
    `users/${portfolio_config.githubUser}/repos`
  );
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

  if (includeReadme && portfolio_config.githubUser) {
    for (const repo of repos) {
      const raw = await fetchReadme(
        portfolio_config.githubUser,
        repo.name,
        repo.default_branch
      );
      if (raw) repo.readme = limitedText(raw);
    }
  }

  return { repos, notice };
}

async function getRepoDetails(
  portfolio_config: Config,
  { repoName, includeReadme = false }: GetRepoDetailsOptions
) {
  try {
    const repo = await fetchGitHubData(
      `repos/${portfolio_config.githubUser}/${repoName}`
    );
    const simplified = simplifyRepo(repo);

    if (includeReadme && portfolio_config.githubUser) {
      let raw = await fetchReadme(
        portfolio_config.githubUser,
        repoName,
        repo.default_branch
      );
      if (raw) {
        simplified.readme = limitedText(raw);
      }
    }

    return simplified;
  } catch (error) {
    if (
      portfolio_config.githubUser &&
      error instanceof Error &&
      error.message.includes("not found")
    ) {
      return await suggestSimilarRepo(repoName, portfolio_config.githubUser);
    }
    throw error;
  }
}

export async function executeFunction(
  functionCall: FunctionCall,
  portfolio_config: Config
) {
  switch (functionCall.name) {
    case "getPersonalInfo":
      return await getPersonalInfo(portfolio_config.personalInfo);

    case "getAllRepos":
      return await getAllRepos(portfolio_config, functionCall.args || {});

    case "getRepoDetails":
      return await getRepoDetails(portfolio_config, functionCall.args);

    default:
      throw new Error(`Unknown function: ${(functionCall as any).name}`);
  }
}
