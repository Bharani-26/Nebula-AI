// src/hooks/useChatStore.ts

import { useCallback, useMemo, useState } from "react";
import { streamGeminiChat, SYSTEM_PERSONA } from "@/lib/gemini";
import { streamOpenRouterChat } from "@/lib/openrouter";
import { MODELS, type ModelConfig } from "@/config/models";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  title: string;
  subtitle: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ChatThread[] = [
  { id: "t-1", title: "Mapping the Orion Arm", subtitle: "2 hours ago", messages: [] },
  { id: "t-2", title: "Ion drive vs solar sail", subtitle: "Yesterday", messages: [] },
  { id: "t-3", title: "Naming a new exoplanet", subtitle: "Yesterday", messages: [] },
  { id: "t-4", title: "Deep field image cleanup", subtitle: "3 days ago", messages: [] },
  { id: "t-5", title: "Signal from Kepler-452b", subtitle: "Last week", messages: [] },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function useChatStore() {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);

  const isHero = messages.length === 0;

  const newChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setIsThinking(false);
  }, []);

  const selectThread = useCallback((id: string) => {
    setActiveId(id);
    setMessages([]);
    setIsThinking(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content) return;

      const userMessage: ChatMessage = { id: uid(), role: "user", content, createdAt: Date.now() };

      // Preserve history before adding the new user message
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      // Create a new thread if none active
      setThreads((prev) => {
        if (activeId) return prev;
        const id = uid();
        setActiveId(id);
        return [
          {
            id,
            title: content.length > 34 ? `${content.slice(0, 34)}…` : content,
            subtitle: "Just now",
            messages: [],
          },
          ...prev,
        ];
      });

      const assistantId = uid();
      let initializedAssistantMsg = false;

      try {
        if (selectedModel.provider === "gemini") {
          await streamGeminiChat(selectedModel.id, history, content, (chunk) => {
            setIsThinking(false);
            setMessages((prev) => {
              if (!initializedAssistantMsg) {
                initializedAssistantMsg = true;
                return [
                  ...prev,
                  { id: assistantId, role: "assistant", content: chunk, createdAt: Date.now() },
                ];
              }
              return prev.map((msg) =>
                msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg,
              );
            });
          });
        } else if (selectedModel.provider === "openrouter") {
          const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
          if (!apiKey) throw new Error("OpenRouter API key missing in VITE_OPENROUTER_API_KEY");
          // prepend system persona for OpenRouter
          const extendedHistory = [
            { role: "assistant" as const, content: SYSTEM_PERSONA },
            ...history,
          ];
          await streamOpenRouterChat(
            selectedModel.id,
            extendedHistory,
            content,
            (chunk) => {
              setIsThinking(false);
              setMessages((prev) => {
                if (!initializedAssistantMsg) {
                  initializedAssistantMsg = true;
                  return [
                    ...prev,
                    { id: assistantId, role: "assistant", content: chunk, createdAt: Date.now() },
                  ];
                }
                return prev.map((msg) =>
                  msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg,
                );
              });
            },
            apiKey,
          );
        }
      } catch (error: unknown) {
        const errMsg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while communicating with the LLM.";
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: `⚠️ ${errMsg}`, createdAt: Date.now() },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [activeId, messages, selectedModel],
  );

  const setModel = (model: ModelConfig) => setSelectedModel(model);

  return useMemo(
    () => ({
      threads,
      activeId,
      messages,
      isThinking,
      isHero,
      newChat,
      selectThread,
      sendMessage,
      selectedModel,
      setModel,
    }),
    [
      threads,
      activeId,
      messages,
      isThinking,
      isHero,
      newChat,
      selectThread,
      sendMessage,
      selectedModel,
    ],
  );
}
