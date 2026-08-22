// src/config/models.ts

export interface ModelConfig {
  id: string; // model identifier used by the provider
  provider: "gemini" | "openrouter"; // provider name
  name: string; // display name
  badge: string; // badge label for UI
}

export const MODELS: ModelConfig[] = [
  {
    id: "gemini-3.6-flash",
    provider: "gemini",
    name: "Gemini",
    badge: "Connected",
  },
];

export default MODELS;
