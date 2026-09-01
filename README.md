Nebula AI — Full-Stack Conversational & RAG Knowledge Engine
Nebula AI is a full-stack, enterprise-grade AI platform featuring real-time token streaming, multi-model support, and an end-to-end Retrieval-Augmented Generation (RAG) knowledge engine. Designed with a sleek, space-themed dark UI inspired by Google Gemini, it resolves traditional LLM limitations like hallucinations and knowledge cutoffs by grounding responses directly in custom user documents.

Key Features

Real-Time Token Streaming: Fluid, low-latency multi-turn chat experience using Gemini 2.5 and 3.6 Flash streaming models.

RAG Knowledge Base Engine: High-dimensional vector search using Google's text-embedding-004 embedding model paired with Supabase pgvector Cosine Similarity calculations.

Interactive Source Citations: Generates grounded answers with clickable source pills pointing back to retrieved vector chunks.

Secure Google OAuth & User Isolation: Built-in authentication powered by Supabase Auth with Row Level Security policies ensuring private document vectors and chat threads remain completely isolated per user.

Multi-Model Routing: Supports dynamic model switching and routing across Google GenAI models and OpenRouter endpoints.

Responsive Cosmic UI: Dark space-themed UI featuring custom glow effects, responsive prompt bar layouts, and clean flex alignment.

Tech Stack

Frontend: React 18, TypeScript, Tailwind CSS, Lucide React, Zustand

AI & Embedding Models: Google Gemini API (gemini-2.5-flash, text-embedding-004)

Backend & Vector Database: Supabase (pgvector extension, PostgreSQL, Row Level Security)

Authentication: Supabase Auth (Google OAuth)



How It Works

User Query Input: The user submits a prompt with the Knowledge Base Search toggle enabled.

Embedding Generation: The system converts the prompt into a 768-dimensional vector using text-embedding-004.

Vector Similarity Matching: Supabase performs a Cosine Distance similarity match against stored document chunks.

Context Injection: Relevant chunks are retrieved and injected directly into the Gemini prompt context.

Grounded Generation: Gemini generates a accurate response accompanied by clickable source attribution tags.

Getting Started

Clone Repository: Download or clone the project repository to your local machine.

Install Dependencies: Run the project package installer via Node Package Manager.

Database Configuration: Enable the vector extension and create the required document chunks table and similarity function inside your Supabase project.

Environment Setup: Add your Gemini API key, Supabase URL, and Supabase Anon Key to your environment configuration.

Run Local Server: Start the development server and open localhost in your browser.
