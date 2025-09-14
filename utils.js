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
