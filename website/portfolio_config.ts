const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("❌ Missing API_URL in .env file.");
}

const MODEL_NAME = "gemini-2.5-flash-lite";
const MODEL_TONE = "default"; // eg: professional, funny, polite, friendly, moody or default

const GITHUB_USER = "MoazMirza-13";

const PERSONAL_INFO = {
  name: "Moaz",
  title: "Full Stack Developer",
  experience: "2 years",
  location: "Narowal",
  skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
  education: "Bs psychology",
  contact: "moazmirza13@gmail.com",
  bio: "Passionate developer who loves to do side projects",
  interests: ["Web Development", "Books", "One piece"],
};

export const portfolio_config = {
  apiUrl: API_URL,
  model: MODEL_NAME,
  tone: MODEL_TONE,
  personalInfo: PERSONAL_INFO,
  githubUser: GITHUB_USER,
};
