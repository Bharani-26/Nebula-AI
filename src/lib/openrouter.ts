// src/lib/openrouter.ts

export interface OpenRouterMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamOpenRouterChat(
  modelId: string,
  history: OpenRouterMessage[],
  userPrompt: string,
  onChunk: (chunkText: string) => void,
  apiKey: string
): Promise<void> {
  const payload = {
    model: modelId,
    messages: [...history, { role: "user", content: userPrompt }],
    stream: true,
    // optional system instruction can be added via a system message
    // We'll prepend a system message for persona
    // Gemini persona is used only for gemini; for openrouter we include as system message
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // OpenRouter streams JSON lines prefixed with "data: "
    const lines = buffer.split("\n");
    // Keep the last incomplete line in buffer
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("data:")) {
        const jsonStr = trimmed.replace(/^data:\s*/, "");
        if (jsonStr === "[DONE]") return; // stream end
        try {
          const data = JSON.parse(jsonStr);
          const content = data?.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // ignore parse errors for non‑JSON lines
        }
      }
    }
  }
}
