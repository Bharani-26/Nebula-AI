import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CosmicBackground } from "./CosmicBackground";
import { HeroState } from "./HeroState";
import { InputBar } from "./InputBar";
import { MessageFeed } from "./MessageFeed";
import { ModelSelector } from "./ModelSelector";
import { NebulaSidebar } from "./NebulaSidebar";
import { useChatStore } from "@/hooks/useChatStore";

export function NebulaWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chat = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-[100dvh] min-h-screen w-full overflow-hidden"
    >
      <CosmicBackground />
      <NebulaSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        threads={chat.threads}
        activeId={chat.activeId}
        onNewChat={chat.newChat}
        onSelect={chat.selectThread}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase sm:text-sm sm:tracking-[0.28em]">
            Nebula AI
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={chat.newChat}
              aria-label="Start a new chat"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-accent transition-colors hover:bg-secondary md:hidden"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="hidden rounded-full border border-border px-3 py-1 text-[11px] tracking-widest text-accent uppercase sm:inline">
              Deep field
            </span>
            <ModelSelector selectedModel={chat.selectedModel} onSelectModel={chat.setModel} />
          </div>
        </header>

        {chat.isHero ? (
          <HeroState onPick={chat.sendMessage} />
        ) : (
          <MessageFeed messages={chat.messages} isThinking={chat.isThinking} />
        )}

        <InputBar onSend={chat.sendMessage} disabled={chat.isThinking} />
      </main>
    </motion.div>
  );
}
