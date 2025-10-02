import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "edge", // for vercel serverless fn
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { model, contents, config } = (await req.json()) as {
      model: string;
      contents: Array<{
        role: "user" | "model";
        parts: Array<{ text: string }>;
      }>;
      config?: Record<string, unknown>;
    };

    if (!model || !contents) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model,
      contents,
      config,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
