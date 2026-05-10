import fs from "fs/promises";
import path from "path";
import { compile } from "tailwindcss";

const inputPath = path.resolve("src/styles.css");
const outputPath = path.resolve("src/tailwind.css");
const sourceDir = path.resolve("src");
const candidatePattern = /[A-Za-z0-9_@!:/.[\]()%#=&*'",-]+/g;
const stringPattern = /(["'`])([\s\S]*?)\1/g;

async function loadStylesheet(id, base) {
  const stylesheetPath = id.startsWith(".")
    ? path.resolve(base, id)
    : path.resolve("node_modules", id);
  const content = await fs.readFile(stylesheetPath, "utf-8");

  return {
    content,
    base: path.dirname(stylesheetPath),
  };
}

async function collectSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(entryPath)));
      continue;
    }

    if (/\.(tsx?|jsx?|html)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

async function collectCandidates() {
  const candidates = new Set();
  const files = await collectSourceFiles(sourceDir);

  const addCandidate = (rawCandidate) => {
    const candidate = rawCandidate.replace(/^['"`{}]+|['"`,{}]+$/g, "");
    if (candidate) candidates.add(candidate);
  };

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");

    for (const match of content.matchAll(candidatePattern)) {
      addCandidate(match[0]);
    }

    for (const match of content.matchAll(stringPattern)) {
      for (const candidate of match[2].split(/\s+/)) {
        addCandidate(candidate);
      }
    }
  }

  return candidates;
}

const input = await fs.readFile(inputPath, "utf-8");
const compiler = await compile(input, {
  base: process.cwd(),
  loadStylesheet,
});
const candidates = await collectCandidates();
const css = compiler.build([...candidates]);

await fs.writeFile(outputPath, css, "utf-8");
