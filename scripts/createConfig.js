#!/usr/bin/env node
import fs from "fs";
import path from "path";

const projectRoot = process.env.INIT_CWD || process.cwd();
const configPath = path.join(projectRoot, "portfolio_config.js");

if (fs.existsSync(configPath)) {
  console.log("portfolio_config.js already exists, skipping creation.");
} else {
  const content = `const API_URL = 'url from env';

if (!API_URL) {
  throw new Error("❌ Missing API_URL in .env file.");
}

const MODEL_NAME = "gemini-2.5-flash-lite";
const MODEL_TONE = "default"; // eg: professional, funny, polite, friendly, moody or default

const GITHUB_USER = "your_github_username";

// add more personal info if needed
const PERSONAL_INFO = {
  name: "your_name",
  title: "Your Title",
  experience: "X years",
  location: "Your Location",
  skills: ["Skill1", "Skill2"],
  education: "Your Education",
  contact: "your_email@example.com",
  bio: "Your bio here",
  interests: ["Interest1", "Interest2"],
};

export const portfolio_config = {
  apiUrl: API_URL,
  model: MODEL_NAME,
  tone: MODEL_TONE,
  personalInfo: PERSONAL_INFO,
  githubUser: GITHUB_USER,
};
`;

  fs.writeFileSync(configPath, content, "utf8");
}
