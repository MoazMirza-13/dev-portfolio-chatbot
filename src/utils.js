export function extractText(response) {
  if (response.text) return response.text;
  if (response.candidates?.length) {
    return response.candidates
      .map((c) => c.content?.parts?.map((p) => p.text).join(" "))
      .join("\n");
  }
  return "";
}

export function limitedText(readme, maxLength = 2000) {
  if (!readme) return "No README available.";

  // Remove badges and images
  let clean = readme.replace(/!\[.*?\]\(.*?\)/g, "").replace(/<img[^>]*>/g, "");

  // Truncate
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength) + "\n\n...(truncated)";
  }

  return clean;
}

export async function safeGenerateContent(ai, options) {
  try {
    return await ai.models.generateContent(options);
  } catch (err) {
    console.error("Gemini error:", err.message);
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
}
