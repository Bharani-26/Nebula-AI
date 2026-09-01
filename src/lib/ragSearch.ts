import { generateEmbedding } from "./ragIngestion";
import { supabase } from "./supabase";

export interface DocumentChunkMatch {
  id: string;
  document_name: string;
  content: string;
  similarity: number;
}

export interface RAGSearchResult {
  chunks: DocumentChunkMatch[];
  sources: string[];
  formattedContext: string;
}

/**
 * Search the Knowledge Base for relevant context using vector similarity search:
 * - Generates query vector embedding via Gemini `text-embedding-004`
 * - Invokes Supabase RPC function `match_document_chunks`
 * - Returns matching chunks, distinct source names, and formatted context
 */
export async function searchKnowledgeBase(
  queryText: string,
  matchThreshold = 0.5,
  matchCount = 3,
): Promise<RAGSearchResult> {
  if (!queryText.trim()) {
    return { chunks: [], sources: [], formattedContext: "" };
  }

  const queryEmbedding = await generateEmbedding(queryText);

  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("[ragSearch] Supabase RPC match_document_chunks error:", error);
    throw new Error(`Knowledge base search failed: ${error.message}`);
  }

  const chunks: DocumentChunkMatch[] = data ?? [];
  const sources = Array.from(new Set(chunks.map((c) => c.document_name)));

  const formattedContext = chunks
    .map((chunk) => `[Source: ${chunk.document_name}]\n${chunk.content}`)
    .join("\n\n");

  return {
    chunks,
    sources,
    formattedContext,
  };
}
