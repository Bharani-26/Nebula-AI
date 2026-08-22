// src/hooks/useChatStore.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MODELS, type ModelConfig } from "@/config/models";
import { saveChatToSupabase, fetchChatsFromSupabase } from "@/services/chatStorage";
import { getUser, onAuthStateChange } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);

  const messagesRef = useRef(messages);
  const activeIdRef = useRef(activeId);
  const userRef = useRef(user);
  messagesRef.current = messages;
  activeIdRef.current = activeId;
  userRef.current = user;

  useEffect(() => {
    getUser().then((u) => setUser(u));
    const { data: subscription } = onAuthStateChange((u, _session) => {
      setUser(u);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

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
      const appendAssistantText = (chunk: string) => {
        setMessages((prev) => {
          const hasAssistantMessage = prev.some((message) => message.id === assistantId);
          if (!hasAssistantMessage) {
            return [
              ...prev,
              { id: assistantId, role: "assistant", content: chunk, createdAt: Date.now() },
            ];
          }

          return prev.map((message) =>
            message.id === assistantId ? { ...message, content: message.content + chunk } : message,
          );
        });
      };

      try {
        if (selectedModel.provider === "gemini") {
          const { streamGeminiChat } = await import("@/lib/gemini");
          await streamGeminiChat(selectedModel.id, history, content, (chunk) => {
            setIsThinking(false);
            appendAssistantText(chunk);
          });
        } else if (selectedModel.provider === "openrouter") {
          const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
          if (!apiKey) throw new Error("OpenRouter API key missing in VITE_OPENROUTER_API_KEY");
          const [{ SYSTEM_PERSONA }, { streamOpenRouterChat }] = await Promise.all([
            import("@/lib/gemini"),
            import("@/lib/openrouter"),
          ]);
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
              appendAssistantText(chunk);
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

        const finalMessages = messagesRef.current;
        const currentActiveId = activeIdRef.current;
        const currentUser = userRef.current;
        if (finalMessages.length > 0 && currentActiveId) {
          const thread = threads.find((t) => t.id === currentActiveId);
          if (thread) {
            saveChatToSupabase(
              thread.title,
              finalMessages,
              selectedModel.id,
              currentActiveId,
              currentUser?.id,
            );
          }
        }
      }
    },
    [activeId, messages, selectedModel, threads],
  );

  const loadChats = useCallback(async () => {
    const records = await fetchChatsFromSupabase(user?.id);
    if (records.length === 0) return;

    const loadedThreads: ChatThread[] = records.map((record) => ({
      id: record.id,
      title: record.title,
      subtitle: new Date(record.created_at).toLocaleDateString(),
      messages: record.messages ?? [],
    }));

    setThreads((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const merged = [...prev];
      for (const thread of loadedThreads) {
        if (!existingIds.has(thread.id)) merged.push(thread);
      }
      return merged;
    });
  }, [user]);

  const setModel = (model: ModelConfig) => setSelectedModel(model);

  return useMemo(
    () => ({
      threads,
      activeId,
      messages,
      isThinking,
      isHero,
      user,
      newChat,
      selectThread,
      sendMessage,
      selectedModel,
      setModel,
      loadChats,
    }),
    [
      threads,
      activeId,
      messages,
      isThinking,
      isHero,
      user,
      newChat,
      selectThread,
      sendMessage,
      selectedModel,
      loadChats,
    ],
  );
}
