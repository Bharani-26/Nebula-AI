-- Enable vector extension if not already enabled
create extension if not exists vector;

-- Table to store document text chunks and vector embeddings
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_name text not null,
  content text not null,
  embedding vector(768) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast similarity searching using vector_cosine_ops
create index if not exists document_chunks_embedding_idx
on document_chunks using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Enable RLS (Row Level Security)
alter table document_chunks enable row level security;

-- Drop existing policies if any exist to allow clean re-execution
drop policy if exists "Allow read access to all users" on document_chunks;
drop policy if exists "Allow insert access to all users" on document_chunks;
drop policy if exists "Allow update access to all users" on document_chunks;
drop policy if exists "Allow delete access to all users" on document_chunks;

-- Policies allowing public (anon & authenticated) full access to document_chunks
create policy "Allow read access to all users" on document_chunks for select to public using (true);
create policy "Allow insert access to all users" on document_chunks for insert to public with check (true);
create policy "Allow update access to all users" on document_chunks for update to public using (true);
create policy "Allow delete access to all users" on document_chunks for delete to public using (true);

-- RPC Function for similarity matching
create or replace function match_document_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  document_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.document_name,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
