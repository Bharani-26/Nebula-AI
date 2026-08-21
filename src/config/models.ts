// src/config/models.ts

export interface ModelConfig {
  id: string; // model identifier used by the provider
  provider: "gemini" | "openrouter"; // provider name
  name: string; // display name
  badge: string; // badge label for UI
}

export const MODELS: ModelConfig[] = [
  {
    id: "gemini-2.5-flash",
    provider: "gemini",
    name: "Nebula Flash",
    badge: "Fastest",
  },
  {
    id: "deepseek/deepseek-r1",
    provider: "openrouter",
    name: "Nebula DeepSeek R1",
    badge: "Reasoning",
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    provider: "openrouter",
    name: "Nebula Claude 3.5",
    badge: "Coding",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    provider: "openrouter",
    name: "Nebula Llama 3.3",
    badge: "Open Source",
  },
];

export default MODELS;
