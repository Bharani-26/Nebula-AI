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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate 768-dimensional vector embedding for given text using Gemini `gemini-embedding-001` with retry backoff.
 */
export async function generateEmbedding(text: string, retries = 5, initialDelay = 1500): Promise<number[]> {
  const apiKey = import.meta.env["VITE_GEMINI_API_KEY"];
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(
      "Gemini API key missing. Please define VITE_GEMINI_API_KEY in your .env.local file.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  let delay = initialDelay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
    } catch (err: unknown) {
      const errorStr = err instanceof Error ? err.message : String(err);
      const isQuotaError =
        errorStr.includes("429") ||
        errorStr.includes("Quota exceeded") ||
        errorStr.includes("RESOURCE_EXHAUSTED");

      if (isQuotaError && attempt < retries) {
        console.warn(
          `[ragIngestion] Rate limit (429) hit. Retrying in ${delay}ms (attempt ${attempt + 1}/${retries})...`,
        );
        await sleep(delay);
        delay *= 2;
      } else {
        throw err;
      }
    }
  }

  throw new Error("Exhausted retries for vector embedding due to Gemini rate limits.");
}

/**
 * Ingest document into Supabase vector database:
 * - Chunks text into ~500 char segments with 50 char overlap
 * - Generates 768-dim vector embeddings via Gemini with pacing & exponential backoff
 * - Inserts records into Supabase `document_chunks` table
 */
export async function ingestDocument(
  fileName: string,
  textContent: string,
  onProgress?: (current: number, total: number) => void,
) {
  const chunks = chunkText(textContent, 500, 50);
  if (chunks.length === 0) {
    throw new Error("Document content is empty.");
  }

  const rows = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    if (onProgress) {
      onProgress(i + 1, chunks.length);
    }

    const embedding = await generateEmbedding(chunk);
    rows.push({
      document_name: fileName,
      content: chunk,
      embedding,
    });

    // Pacing delay (350ms) between chunk requests to respect RPM quota
    if (i < chunks.length - 1) {
      await sleep(350);
    }
  }

  const { data, error } = await supabase
    .from("document_chunks")
    .insert(rows)
    .select("id, document_name, content");

  if (error) {
    console.error("[ragIngestion] Supabase insertion error:", error);
    throw new Error(`Failed to ingest document chunks: ${error.message}`);
  }

  return data;
}
