import { GoogleGenAI } from "@google/genai";

export interface GeminiMessageInput {
  role: "user" | "assistant";
  content: string;
}

export const SYSTEM_PERSONA = "Nebula AI, a sleek and ultra-intelligent cosmic assistant";

export async function streamGeminiChat(
  modelId: string,
  history: GeminiMessageInput[],
  userPrompt: string,
  onChunk: (chunkText: string) => void,
  systemContext?: string,
): Promise<string> {
  const apiKey = import.meta.env["VITE_GEMINI_API_KEY"];

  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(
      "API Key missing. Please define VITE_GEMINI_API_KEY in your .env.local file to communicate with Nebula AI.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Format message history for Gemini SDK
  const contents = [
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
  ];

  const systemInstruction = systemContext
    ? `${SYSTEM_PERSONA}\n\nAnswer using ONLY the provided context below:\n--- CONTEXT ---\n${systemContext}\n--- END CONTEXT ---`
    : SYSTEM_PERSONA;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents,
      config: {
        systemInstruction,
      },
    });

    const fullText = response.text ?? "";

    if (!fullText.trim()) {
      throw new Error("Gemini returned an empty response. Please try again.");
    }

    onChunk(fullText);
    return fullText;
  } catch (error: unknown) {
    let cleanMessage =
      error instanceof Error ? error.message : "Failed to communicate with Gemini.";
    try {
      const parsed = JSON.parse(cleanMessage);
      if (parsed?.error?.message) {
        cleanMessage = parsed.error.message;
      }
    } catch (_) {
      // not JSON string, keep cleanMessage as is
    }
    throw new Error(cleanMessage);
  }
}
