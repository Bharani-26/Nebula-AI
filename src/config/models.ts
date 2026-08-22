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
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    provider: "openrouter",
    name: "Nemotron Lightning",
    badge: "OpenRouter",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    provider: "openrouter",
    name: "Nemotron 3 Super",
    badge: "OpenRouter",
  },
];

export default MODELS;
