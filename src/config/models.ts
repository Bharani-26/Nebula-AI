// src/config/models.ts

export interface ModelConfig {
  id: string;
  provider: "gemini" | "openrouter";
  name: string;
  badge: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "gemini-2.5-flash",
    provider: "gemini",
    name: "Gemini 2.5 Flash",
    badge: "Google",
  },
  {
    id: "deepseek/deepseek-r1",
    provider: "openrouter",
    name: "DeepSeek R1",
    badge: "OpenRouter",
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    provider: "openrouter",
    name: "Claude Sonnet 4.5",
    badge: "OpenRouter",
  },
  {
    id: "google/gemma-4-31b-it:free",
    provider: "openrouter",
    name: "Gemma 4 31B",
    badge: "OpenRouter",
  },
  {
    id: "z-ai/glm-5.2:free",
    provider: "openrouter",
    name: "GLM 5.2",
    badge: "OpenRouter",
  },
];

export default MODELS;
