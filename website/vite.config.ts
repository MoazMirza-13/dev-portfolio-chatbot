import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "dev-portfolio-chatbot": path.resolve(__dirname, "../src/index.react.ts"), // for hot reloading from root dir files
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
