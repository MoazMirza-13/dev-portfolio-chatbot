import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    outDir: "dist/react",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ChatbotWidget",
      formats: ["es", "umd"],
      fileName: (format: string) => `chatbot-widget.${format}.js`,
    },
    target: "es2020",
    sourcemap: true,
    minify: "esbuild",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
