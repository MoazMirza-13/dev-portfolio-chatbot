import fs from "fs";
import path from "path";

const jsPath = path.resolve("dist/index.js");
const cssPath = path.resolve("src/tailwind.css");

if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
  console.error("❌ dist/index.js or src/tailwind.css not found!");
  process.exit(1);
}

const jsCode = fs.readFileSync(jsPath, "utf-8");
const cssCode = fs.readFileSync(cssPath, "utf-8");

// Escape backticks for template literal safety
const escapedCSS = cssCode.replace(/`/g, "\\`");

const injectionCode = `
(function() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = \`${escapedCSS}\`;
    document.head.appendChild(style);
  }
})();
`;

fs.writeFileSync(jsPath, `${injectionCode}\n${jsCode}`, "utf-8");
