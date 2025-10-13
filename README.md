# Dev Portfolio Chatbot

An AI-powered chatbot for developers’ portfolio websites. It uses **Google Gemini API** to answer questions about the developer dynamically from live GitHub data and personalized info.

[![npm version](https://img.shields.io/npm/v/dev-portfolio-chatbot)](https://www.npmjs.com/package/dev-portfolio-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Portfolio Config](#portfolio-config)

  - [API URL Setup](#api-url-setup)

- [Header & Footer Detection](#header--footer-detection)
- [Chatbot Widget Props](#chatbot-widget-props)
- [Usage Examples](#usage-examples)
- [Limitations](#limitations)
- [Important](#important)

---

## Features

- AI-powered chatbot for your portfolio.
- Live GitHub data fetching.
- Configurable personal info and tone.
- **Framework-agnostic**: React component, Web Component for Angular/Vue/plain HTML, etc.
- Automatic generation of `portfolio_config.js` on install.
- Detects **header** and **footer** on your page to move the chatbot dynamically.
- Supports multiple **positions** and **sizes**.

---

## Installation

```bash
npm install dev-portfolio-chatbot
```

> After installation, a `portfolio_config.js` file is automatically generated in your project root. You can edit it to provide your info.

---

## Portfolio Config

The generated `portfolio_config.js` looks like this:

```js
const API_URL = "api_endpoint_here";

const MODEL_NAME = "gemini-2.5-flash-lite";
const MODEL_TONE = "default"; // professional, funny, polite, friendly, moody, or default

const GITHUB_USER = "your_github_username";

// add more info if you want
const PERSONAL_INFO = {
  name: "Your Name",
  title: "Your Title",
  experience: "X years",
  location: "Your Location",
  skills: ["Skill1", "Skill2"],
  education: "Your Education",
  contact: "your_email@example.com",
  bio: "Your bio here",
  interests: ["Interest1", "Interest2"],
};

export const portfolio_config = {
  apiUrl: API_URL,
  model: MODEL_NAME,
  tone: MODEL_TONE,
  personalInfo: PERSONAL_INFO,
  githubUser: GITHUB_USER,
};
```

### API URL Setup

Gemini API keys **cannot be exposed on the client side** for security reasons. You need a server to proxy requests. Here are two options:

#### Option 1: Serverless Functions (e.g., Vercel, Next.js, or serverless routes)

Use a serverless function to handle API calls. If deploying on Vercel, files in `/api/` are treated as serverless functions.

Add your Gemini API key as an environment variable `GEMINI_API_KEY`.

In `portfolio_config.js`, set `API_URL` to your deployed endpoint:

```js
const API_URL = "https://your-site.vercel.app/api/ai";
```

> Example `/api/ai.ts` (compatible with Vercel Edge Functions or Next.js API routes):

This repo also uses this option. [See here](https://github.com/MoazMirza-13/dev-portfolio-chatbot/blob/main/api/ai.ts)

#### Option 2: Express Server

If you can not use option 1 and prefer having a full backend, you can use an Express server. A ready-to-use example is available in this companion repo: [dev-portfolio-chatbot-backend](https://github.com/MoazMirza-13/dev-portfolio-chatbot-backend).

You can also deploy it to Vercel with a single click:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/MoazMirza-13/dev-portfolio-chatbot-backend)

Steps to get started:

1. Click the button above to deploy the backend to your Vercel account.
2. Add your `GEMINI_API_KEY` in Vercel’s environment variables.
3. In `portfolio_config.js`, set `API_URL` to your deployed backend URL (e.g., `https://your_deployed_vercel.vercel.app/api/ai`).

Now your backend will handle API requests securely, keeping your Gemini API key protected.

> Note: without env variable, it will return 500. Don't forget to redeploy after adding the env variable.

---

## Header & Footer Detection

The chatbot can automatically adjust its position based on the presence of header and footer elements.

- Make sure your **header** has `id="header"`.
- Make sure your **footer** has `id="footer"`.

This allows the chatbot to avoid overlapping with your main layout.

---

## Chatbot Widget Props

| Prop       | Available Options                                              | Default          | Description                          |
| ---------- | -------------------------------------------------------------- | ---------------- | ------------------------------------ |
| `position` | `"right-bottom" \| "left-bottom" \| "right-top" \| "left-top"` | `"right-bottom"` | Position of the widget on the page   |
| `size`     | `"small" \| "medium" \| "large"`                               | `"medium"`       | Size of the chat window              |
| `config`   | `Config`                                                       | required         | Configuration object for the chatbot |

---

## Usage Examples

This chatbot is framework-agnostic and works everywhere. Here are some example setups to get started:

### React

```tsx
import { ChatbotWidget } from "dev-portfolio-chatbot";
import { portfolio_config } from "../portfolio_config"; // adjust path if needed

function App() {
  return (
    <>
      <h1>React Example</h1>
      <ChatbotWidget config={portfolio_config} />
    </>
  );
}

export default App;
```

### Angular

1. **Load the Web Component**
   Add this in `src/index.html`:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/dev-portfolio-chatbot/dist/vanilla/chatbot-widget.vanilla.js"
></script>
```

2. **Add Widget in Template**

```html
<chatbot-widget
  id="chatbot"
  position="right-bottom"
  size="medium"
></chatbot-widget>
```

3. **Configure Widget After Render**

```ts
import { Component, NgZone, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { portfolio_config } from "../../portfolio_config.js";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  constructor(private ngZone: NgZone) {
    this.ngZone.onStable.subscribe(() => {
      const chatbot = document.getElementById("chatbot") as any;
      if (chatbot && !chatbot.config) {
        chatbot.config = portfolio_config;
      }
    });
  }
}
```

---

### Vue

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/dev-portfolio-chatbot/dist/vanilla/chatbot-widget.vanilla.js"
></script>

<template>
  <chatbot-widget id="bot"></chatbot-widget>
</template>

<script setup>
  import { onMounted } from "vue";
  import { portfolio_config } from "../portfolio_config.js";

  onMounted(() => {
    const bot = document.getElementById("bot");
    if (bot) bot.config = portfolio_config;
  });
</script>
```

---

### Plain HTML

```html
<chatbot-widget
  id="chatbot"
  position="right-bottom"
  size="medium"
></chatbot-widget>

<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/dev-portfolio-chatbot/dist/vanilla/chatbot-widget.vanilla.js"
></script>

<script type="module">
  import { portfolio_config } from "./portfolio_config.js";
  const chatbot = document.getElementById("chatbot");
  chatbot.config = portfolio_config;
</script>
```

---

> These examples demonstrate the flexibility of the chatbot. You can adapt the same approach for other frameworks or vanilla JS setups by referring to these samples.

---

## Limitations

- **Google Gemini API**: Free tier allows **15 requests per minute (RPM)**.
- **GitHub API**: Free tier allows **60 requests per hour (RPH) per IP**; you can increase this using a GitHub personal access token.

> For most **dev-portfolio-chatbot** setups, these free tiers are sufficient. If your site has high traffic, consider upgrading your Gemini API plan and using GitHub tokens for higher request limits.

---

## Important

Since this chatbot fetches data directly from GitHub public repositories, adding more information there improves its responses. Make sure your repositories have detailed:

- `README.md` files
- Descriptions
- Homepage URLs
- Other relevant metadata

The richer the GitHub data, the better the chatbot can answer questions about your portfolio.
