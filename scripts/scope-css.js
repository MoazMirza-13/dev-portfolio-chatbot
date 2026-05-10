import fs from "fs";
import path from "path";

const cssPath = path.resolve("src/tailwind.css");
const scope = ".chatbot-widget-root";

if (!fs.existsSync(cssPath)) {
  console.error("src/tailwind.css not found. Run the Tailwind build first.");
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf-8");

function splitSelectors(selectorText) {
  const selectors = [];
  let current = "";
  let depth = 0;
  let quote = null;

  for (let i = 0; i < selectorText.length; i += 1) {
    const char = selectorText[i];
    const previous = selectorText[i - 1];

    if ((char === '"' || char === "'") && previous !== "\\") {
      quote = quote === char ? null : quote || char;
    }

    if (!quote) {
      if (char === "(" || char === "[") depth += 1;
      if (char === ")" || char === "]") depth -= 1;

      if (char === "," && depth === 0) {
        selectors.push(current.trim());
        current = "";
        continue;
      }
    }

    current += char;
  }

  if (current.trim()) selectors.push(current.trim());
  return selectors;
}

function scopeSelector(selector) {
  if (!selector || selector.startsWith("&") || selector.includes(scope)) {
    return selector;
  }

  if (selector === ":root" || selector === ":host") {
    return scope;
  }

  if (selector === "*") {
    return `${scope}, ${scope} *`;
  }

  return `${scope} ${selector}`;
}

function scopeSelectorList(selectorText) {
  return [...new Set(splitSelectors(selectorText).map(scopeSelector))].join(", ");
}

function findMatchingBrace(input, openIndex) {
  let depth = 0;
  let quote = null;

  for (let i = openIndex; i < input.length; i += 1) {
    const char = input[i];
    const previous = input[i - 1];

    if ((char === '"' || char === "'") && previous !== "\\") {
      quote = quote === char ? null : quote || char;
    }

    if (quote) continue;

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function scopeRules(input) {
  let output = "";
  let cursor = 0;

  while (cursor < input.length) {
    const openIndex = input.indexOf("{", cursor);
    if (openIndex === -1) {
      output += input.slice(cursor);
      break;
    }

    const preludeStart =
      Math.max(input.lastIndexOf("}", openIndex - 1), input.lastIndexOf(";", openIndex - 1)) + 1;
    output += input.slice(cursor, preludeStart);

    const prelude = input.slice(preludeStart, openIndex).trim();
    const closeIndex = findMatchingBrace(input, openIndex);

    if (closeIndex === -1) {
      output += input.slice(preludeStart);
      break;
    }

    const body = input.slice(openIndex + 1, closeIndex);
    const isAtRule = prelude.startsWith("@");
    const shouldRecurse =
      isAtRule &&
      !prelude.startsWith("@keyframes") &&
      !prelude.startsWith("@property") &&
      !prelude.startsWith("@font-face");

    const nextPrelude = isAtRule ? prelude : scopeSelectorList(prelude);
    const nextBody = shouldRecurse ? scopeRules(body) : body;

    output += `${nextPrelude} {${nextBody}}`;
    cursor = closeIndex + 1;
  }

  return output;
}

fs.writeFileSync(cssPath, scopeRules(css), "utf-8");
