import dotenv from "dotenv";
dotenv.config();

export const API_KEY = process.env.GEMINI_API_KEY;
export const GITHUB_USER = process.env.GITHUB_USERNAME;

if (!API_KEY || !GITHUB_USER) {
  throw new Error("❌ Missing GEMINI_API_KEY or GITHUB_USERNAME in .env file.");
}

export const MODEL_NAME = "gemini-2.5-flash-lite";

export const MODEL_TONE = "default"; // eg: professional, funny, polite, friendly, moody or default

export const PERSONAL_INFO = {
  name: "Moaz",
  title: "Full Stack Developer",
  experience: "2 years",
  location: "Narowal",
  skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
  education: "Bs psychologist",
  contact: "blahblah.com",
  bio: "Passionate developer who loves to do side projects",
  interests: ["Web Development", "killing humans :)", "Open Source"],
  git_username: GITHUB_USER,
};
