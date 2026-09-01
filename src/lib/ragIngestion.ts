import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabase";

/**
 * Splitting text into ~500-character segments with 50-character overlap.
 */
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  const cleaned = text.trim();
  if (!cleaned) return chunks;

  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    const chunk = cleaned.slice(start, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    if (end >= cleaned.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

/**
 * Generate 768-dimensional vector embedding for given text using Gemini `text-embedding-004`.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = import.meta.env["VITE_GEMINI_API_KEY"];
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(
      "Gemini API key missing. Please define VITE_GEMINI_API_KEY in your .env.local file.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values || !Array.isArray(values) || values.length === 0) {
    throw new Error("Failed to generate vector embedding from Gemini embedding model.");
  }

  return values;
}

/**
 * Ingest document into Supabase vector database:
 * - Chunks text into ~500 char segments with 50 char overlap
 * - Generates 768-dim vector embeddings via Gemini text-embedding-004
 * - Inserts records into Supabase `document_chunks` table
 */
export async function ingestDocument(fileName: string, textContent: string) {
  const chunks = chunkText(textContent, 500, 50);
  if (chunks.length === 0) {
    throw new Error("Document content is empty.");
  }

  const rows = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    rows.push({
      document_name: fileName,
      content: chunk,
      embedding,
    });
  }

  const { data, error } = await supabase.from("document_chunks").insert(rows).select("id, document_name, content");

  if (error) {
    console.error("[ragIngestion] Supabase insertion error:", error);
    throw new Error(`Failed to ingest document chunks: ${error.message}`);
  }

  return data;
}
