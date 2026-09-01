import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type DragEvent } from "react";
import { ingestDocument } from "@/lib/ragIngestion";
import { extractTextFromPdf } from "@/lib/pdfExtractor";

interface DocumentIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentIngestModal({ isOpen, onClose }: DocumentIngestModalProps) {
  const [fileName, setFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setErrorMsg(null);
    setSuccessCount(null);

    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";

    if (isPdf) {
      setIsParsingPdf(true);
      try {
        const extractedText = await extractTextFromPdf(file);
        if (!extractedText.trim()) {
          setErrorMsg("Could not extract readable text from PDF. It may be image-only or password protected.");
        } else {
          setTextContent(extractedText);
        }
      } catch (err: unknown) {
        console.error("[DocumentIngestModal] PDF extraction error:", err);
        const msg = err instanceof Error ? err.message : "Failed to parse PDF text.";
        setErrorMsg(`PDF Parsing Error: ${msg}`);
      } finally {
        setIsParsingPdf(false);
      }
    } else {
      try {
        const text = await file.text();
        setTextContent(text);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to read file.";
        setErrorMsg(`File Read Error: ${msg}`);
      }
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleIngest = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessCount(null);

    const docName = fileName.trim() || "document.pdf";
    const docText = textContent.trim();

    if (!docText) {
      setErrorMsg("Please select a file or enter document text to ingest.");
      return;
    }

    setLoading(true);
    setProgressText("Preparing document chunks...");

    try {
      const inserted = await ingestDocument(docName, docText, (current, total) => {
        setProgressText(`Embedding chunk ${current} of ${total}...`);
      });
      setSuccessCount(inserted?.length ?? 0);
      setTextContent("");
      setFileName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Document ingestion failed.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setProgressText("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl bg-zinc-950/90 text-foreground"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">RAG Document Ingestion</h3>
                  <p className="text-xs text-muted-foreground">
                    Embed documents into Supabase vector storage via Gemini `text-embedding-004`
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleIngest} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Document File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. company_policy.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Upload File or Paste Content
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="rounded-xl border border-dashed border-white/15 bg-zinc-900/50 p-3 transition-colors hover:border-cyan-500/40 mb-2"
                >
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-secondary px-3.5 py-2 text-xs font-medium transition-colors hover:bg-secondary/80">
                      <Upload className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Choose File (.pdf, .txt, .md, .json)</span>
                      <input
                        type="file"
                        accept=".pdf,.txt,.md,.json,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {fileName && (
                      <span className="flex items-center gap-1 text-xs text-cyan-400 truncate max-w-[200px]">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        {fileName}
                      </span>
                    )}
                  </div>
                </div>

                {isParsingPdf ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-6 text-xs text-cyan-300 animate-pulse">
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
                    Parsing PDF text... extracting pages via pdfjs-dist.
                  </div>
                ) : (
                  <textarea
                    rows={5}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste document text or drop a file to extract clean text and embed..."
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none font-mono"
                  />
                )}
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-3 text-xs text-red-300">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successCount !== null && (
                <div className="rounded-xl bg-cyan-950/50 border border-cyan-500/40 p-3 text-xs text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  Successfully ingested document! Created and inserted {successCount} vector chunk(s).
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isParsingPdf || (!fileName && !textContent)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50 transition-all"
                  style={{ background: "var(--gradient-nebula)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {progressText || "Embedding Chunks…"}
                    </>
                  ) : isParsingPdf ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Parsing PDF…
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5" />
                      Ingest Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
