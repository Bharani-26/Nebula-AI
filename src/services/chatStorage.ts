import { supabase } from "@/lib/supabase";
import type { ChatMessage } from "@/hooks/useChatStore";

export interface ChatRecord {
  id: string;
  title: string;
  messages: ChatMessage[];
  model_used: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function saveChatToSupabase(
  title: string,
  messages: ChatMessage[],
  modelUsed: string,
  chatId?: string,
  userId?: string | null,
): Promise<ChatRecord | null> {
  const now = new Date().toISOString();
  const payload = {
    id: chatId,
    title,
    messages,
    model_used: modelUsed,
    user_id: userId ?? null,
    updated_at: now,
  };

  const { data, error } = chatId
    ? await supabase.from("chats").upsert(payload).select().single()
    : await supabase.from("chats").insert(payload).select().single();

  if (error) {
    console.error("[Supabase] Failed to save chat:", error.message);
    return null;
  }

  return data as ChatRecord;
}

export async function fetchChatsFromSupabase(
  userId?: string | null,
): Promise<ChatRecord[]> {
  let query = supabase.from("chats").select("*").order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Failed to fetch chats:", error.message);
    return [];
  }

  return (data as ChatRecord[]) ?? [];
}
