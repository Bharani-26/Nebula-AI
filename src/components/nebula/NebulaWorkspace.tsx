import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";

import { AuthButton } from "@/components/AuthButton";
import { CosmicBackground } from "./CosmicBackground";
import { DocumentIngestModal } from "./DocumentIngestModal";
import { HeroState } from "./HeroState";
import { InputBar } from "./InputBar";
import { MessageFeed } from "./MessageFeed";
import { NebulaSidebar } from "./NebulaSidebar";
import { useChatStore } from "@/hooks/useChatStore";

export function NebulaWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const chat = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-screen w-full overflow-hidden"
    >
      <CosmicBackground />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <NebulaSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        threads={chat.threads}
        activeId={chat.activeId}
        onNewChat={chat.newChat}
        onSelect={(id) => {
          chat.selectThread(id);
          setSidebarOpen(false);
        }}
        user={chat.user}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="rounded-lg p-2 text-muted-foreground transition-all duration-300 ease-in-out hover:scale-110 hover:text-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              <Sparkles className="h-5 w-5" />
            </button>
            <h2 className="font-display text-sm tracking-[0.28em] text-muted-foreground uppercase">
              Nebula AI
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIngestModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-[11px] font-medium tracking-wider text-cyan-300 uppercase transition-all duration-300 hover:bg-cyan-900/60 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              Ingest Doc
            </button>
            <span className="rounded-full border border-border px-3 py-1 text-[11px] tracking-widest text-accent uppercase">
              Deep field
            </span>
          </div>
        </header>

        {chat.isHero ? (
          <HeroState onPick={chat.sendMessage} user={chat.user} />
        ) : (
          <MessageFeed messages={chat.messages} isThinking={chat.isThinking} />
        )}

        <InputBar
          onSend={chat.sendMessage}
          disabled={chat.isThinking}
          selectedModel={chat.selectedModel}
          onSelectModel={chat.setModel}
          onOpenIngestModal={() => setIngestModalOpen(true)}
        />

        <DocumentIngestModal
          isOpen={ingestModalOpen}
          onClose={() => setIngestModalOpen(false)}
        />
      </main>
    </motion.div>
  );
}
