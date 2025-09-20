/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GITHUB_USERNAME: string;
  // Add more VITE_ vars here as you define them in .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
