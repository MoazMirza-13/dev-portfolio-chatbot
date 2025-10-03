export interface GetAllReposOptions {
  sortBy?: string | null;
  order?: "asc" | "desc";
  limit?: number;
  includeReadme?: boolean;
}

export type GetAllReposResult = {
  repos: SimplifiedRepo[];
  notice?: string;
};

export interface GetRepoDetailsOptions {
  repoName: string;
  includeReadme?: boolean;
}

export type FunctionCall =
  | { name: "getPersonalInfo"; args?: undefined }
  | { name: "getAllRepos"; args?: GetAllReposOptions }
  | { name: "getRepoDetails"; args: GetRepoDetailsOptions };

export type SimplifiedRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  visibility: string;
  default_branch: string;
  homepage: string;
  readme?: string;
};

export interface Config {
  apiUrl: string;
  githubUser: string;
  model: string;
  tone: string;
  personalInfo: {
    name: string;
    title: string;
    experience: string;
    location: string;
    skills: string[];
    education: string;
    contact: string;
    bio: string;
    interests: string[];
  };
}
