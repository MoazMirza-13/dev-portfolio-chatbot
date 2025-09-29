import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    "process.env": {},
  },
  build: {
    outDir: "dist/vanilla",
    lib: {
      entry: path.resolve(__dirname, "src/vanilla/index.ts"),
      name: "ChatbotWidget",
      formats: ["iife"],
      fileName: () => `chatbot-widget.vanilla.js`,
    },
    target: "es2020",
    sourcemap: true,
    minify: "esbuild",
    rollupOptions: {
      // no externals → bundle React inside
    },
  },
});
