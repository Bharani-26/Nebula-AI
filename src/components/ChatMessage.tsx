import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import mark from "@/assets/nebula-mark.png";

export interface ChatMessageProps {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  createdAt?: number;
  onSourceClick?: (sourceName: string) => void;
}

function StarlightAvatar() {
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
      style={{ boxShadow: "var(--shadow-halo)" }}
    >
      <img src={mark} alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7" />
    </span>
  );
}

function formatInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function FormattedContent({ content }: { content: string }) {
  const lines = content
    .replace(/\\([*_#`])/g, "$1")
    .replace(/\s*---\s*(?=#{1,3}\s)/g, "\n\n")
    .split(/\r?\n/);

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" aria-hidden="true" />;

        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading && heading[1] && heading[2]) {
          const level = heading[1].length;
          return (
            <h3
              key={index}
              className={
                level === 1
                  ? "font-display text-xl font-semibold"
                  : level === 2
                    ? "font-display text-lg font-semibold"
                    : "font-display text-base font-semibold text-accent"
              }
            >
              {formatInline(heading[2])}
            </h3>
          );
        }

        const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
        if (unordered && unordered[1]) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{formatInline(unordered[1])}</span>
            </div>
          );
        }

        const ordered = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (ordered && ordered[1] && ordered[2]) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="min-w-5 font-medium text-accent">{ordered[1]}.</span>
              <span>{formatInline(ordered[2])}</span>
            </div>
          );
        }

        return <p key={index}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

export function ChatMessage({ role, content, sources, onSourceClick }: ChatMessageProps) {
  if (role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end"
      >
        <p
          className="max-w-[80%] rounded-3xl rounded-br-md px-5 py-3 text-sm leading-relaxed text-primary-foreground"
          style={{ background: "var(--gradient-nebula)" }}
        >
          {content}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      <StarlightAvatar />
      <div className="max-w-[85%] space-y-3 pt-1 text-sm leading-relaxed text-foreground">
        <FormattedContent content={content} />

        {/* Citation UI: Display clickable source tags beneath the AI message */}
        {sources && sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              Retrieved Context:
            </span>
            {sources.map((source, index) => (
              <button
                key={index}
                onClick={() => onSourceClick?.(source)}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 transition-all duration-200 hover:bg-cyan-900/80 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <FileText className="h-3 w-3 text-cyan-400 shrink-0" />
                <span>[Source: {source}]</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
