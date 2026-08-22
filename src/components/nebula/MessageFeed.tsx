import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import mark from "@/assets/nebula-mark.png";
import type { ChatMessage } from "@/hooks/useChatStore";

interface MessageFeedProps {
  messages: ChatMessage[];
  isThinking: boolean;
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

function AssistantMessage({ content }: { content: string }) {
  const lines = content
    .replace(/\\([*_#`])/g, "$1")
    .replace(/\s*---\s*(?=#{1,3}\s)/g, "\n\n")
    .split(/\r?\n/);

  return (
    <div className="max-w-[85%] space-y-3 pt-1 text-sm leading-relaxed text-foreground">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" aria-hidden="true" />;

        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
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
        if (unordered) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{formatInline(unordered[1])}</span>
            </div>
          );
        }

        const ordered = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (ordered) {
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

export function MessageFeed({ messages, isThinking }: MessageFeedProps) {
  const endRef = useRef<HTMLDivElement>(null);

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastMessageContent, isThinking]);

  return (
    <div className="cosmic-scroll flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
        {messages.map((m) =>
          m.role === "user" ? (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-end"
            >
              <p
                className="max-w-[80%] rounded-3xl rounded-br-md px-5 py-3 text-sm leading-relaxed text-primary-foreground"
                style={{ background: "var(--gradient-nebula)" }}
              >
                {m.content}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4"
            >
              <StarlightAvatar />
              <AssistantMessage content={m.content} />
            </motion.div>
          ),
        )}

        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              <StarlightAvatar />
              <span className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                Nebula is thinking
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      style={{ animation: `star-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
