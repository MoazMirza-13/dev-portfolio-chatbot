import levenshtein from "js-levenshtein";
import { SimplifiedRepo } from "./types";

export function simplifyRepo(repo: SimplifiedRepo): SimplifiedRepo {
  const simplifiedRepo = {
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    language: repo.language,
    topics: repo.topics,
    created_at: repo.created_at,
    pushed_at: repo.pushed_at,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    visibility: repo.visibility,
    default_branch: repo.default_branch,
    homepage: repo.homepage,
  };

  return simplifiedRepo;
}

export async function fetchGitHubData(endpoint: string) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `https://api.github.com/${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "node.js",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error(`Repo not found at ${url}.`);
    if (res.status === 403) {
      throw new Error("GitHub API rate limit reached. Try again later.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchReadme(
  username: string,
  repoName: string,
  defaultBranch = "main"
) {
  const url = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/README.md`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Failed to fetch README for ${repoName}:`, err.message);
    } else {
      console.error(`❌ Failed to fetch README for ${repoName}:`, err);
    }
    return null;
  }
}

export async function suggestSimilarRepo(
  userRepo: string,
  gitUsername: string
) {
  const repos: SimplifiedRepo[] = await fetchGitHubData(
    `users/${gitUsername}/repos`
  );
  const names = repos.map((r) => r.name);

  let bestMatch = null;
  let minDistance = Infinity;

  for (const name of names) {
    const dist = levenshtein(userRepo.toLowerCase(), name.toLowerCase());
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = name;
    }
  }

  if (minDistance <= 3) {
    return `⚠️ Did you mean **${bestMatch}**?`;
  }
  return "I couldn’t find that repository. Please check for typos.";
}
