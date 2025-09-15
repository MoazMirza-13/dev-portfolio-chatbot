export function simplifyRepo(repo) {
  return {
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    language: repo.language,
    topics: repo.topics,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    visibility: repo.visibility,
  };
}

export async function fetchGitHubData(endpoint) {
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
    if (res.status === 404) {
      throw new Error(`Repo not found at ${url}. Maybe a typo in the name?`);
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchReadme(username, repoName) {
  const url = `https://raw.githubusercontent.com/${username}/${repoName}/main/README.md`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
