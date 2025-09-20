const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GITHUB_USER = import.meta.env.VITE_GITHUB_USERNAME;

if (!API_KEY || !GITHUB_USER) {
  throw new Error("❌ Missing GEMINI_API_KEY or GITHUB_USERNAME in .env file.");
}

const MODEL_NAME = "gemini-2.5-flash-lite";

const MODEL_TONE = "default"; // eg: professional, funny, polite, friendly, moody or default

const PERSONAL_INFO = {
  name: "Moaz",
  title: "Full Stack Developer",
  experience: "2 years",
  location: "Narowal",
  skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
  education: "Bs psychologist",
  contact: "blahblah.com",
  bio: "Passionate developer who loves to do side projects",
  interests: ["Web Development", "killing humans :)", "Open Source"],
};

export const portfolio_config = {
  apiKey: API_KEY,
  model: MODEL_NAME,
  tone: MODEL_TONE,
  personalInfo: PERSONAL_INFO,
  githubUser: GITHUB_USER,
};
