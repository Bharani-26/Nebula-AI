import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";

import { AuthButton } from "@/components/AuthButton";
import { CosmicBackground } from "./CosmicBackground";
import { HeroState } from "./HeroState";
import { InputBar } from "./InputBar";
import { MessageFeed } from "./MessageFeed";
import { NebulaSidebar } from "./NebulaSidebar";
import { useChatStore } from "@/hooks/useChatStore";

export function NebulaWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-display text-sm tracking-[0.28em] text-muted-foreground uppercase">
              Nebula AI
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton user={chat.user} />
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
        />
      </main>
    </motion.div>
  );
}
