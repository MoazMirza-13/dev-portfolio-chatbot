import type { GenerateContentResponse, GoogleGenAI } from "@google/genai";

type GenerateContentOptions = Omit<
  Parameters<GoogleGenAI["models"]["generateContent"]>[0],
  "model"
> & {
  model: string | string[];
};

export function extractText(response: GenerateContentResponse) {
  if (response.text) return response.text;
  if (response.candidates?.length) {
    return response.candidates
      .map((c) => c.content?.parts?.map((p) => p.text).join(" "))
      .join("\n");
  }
  return "";
}

export function limitedText(readme: string, maxLength = 2000) {
  if (!readme) return "No README available.";

  // Remove badges and images
  let clean = readme.replace(/!\[.*?\]\(.*?\)/g, "").replace(/<img[^>]*>/g, "");

  // Truncate
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength) + "\n\n...(truncated)";
  }

  return clean;
}

export async function safeGenerateContent(
  apiUrl: string,
  options: GenerateContentOptions
) {
  const models = Array.isArray(options.model) ? options.model : [options.model];

  for (const model of models) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...options, model }),
      });

      if (!response.ok) {
        throw new Error(
          `Proxy error for ${model}: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (err) {
      const error = err as Error;
      console.error("Gemini error:", error.message);
    }
  }

  return {
    candidates: [
      {
        content: {
          parts: [
            {
              text: "⚠️ Sorry, I couldn’t process that request right now. Try a different question or the model might get overloaded. Please try again later.",
            },
          ],
        },
      },
    ],
  };
}
