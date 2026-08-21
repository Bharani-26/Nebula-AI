import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

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

export function MessageFeed({ messages, isThinking }: MessageFeedProps) {
  const endRef = useRef<HTMLDivElement>(null);

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastMessageContent, isThinking]);

  return (
    <div className="cosmic-scroll flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
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
              <p className="max-w-[85%] pt-1 text-sm leading-relaxed text-foreground">
                {m.content}
              </p>
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
