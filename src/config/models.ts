// src/config/models.ts

export interface ModelConfig {
  id: string;
  provider: "gemini" | "openrouter";
  name: string;
  badge: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "gemini-3.6-flash",
    provider: "gemini",
    name: "Gemini 3.6 Flash",
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
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    provider: "openrouter",
    name: "Nemotron 3 Nano",
    badge: "OpenRouter",
  },
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    provider: "openrouter",
    name: "Nemotron Lightning",
    badge: "OpenRouter",
  },
];

export default MODELS;
