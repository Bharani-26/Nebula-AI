import { motion } from "framer-motion";
import { useState } from "react";

import { AuthButton } from "@/components/AuthButton";
import { CosmicBackground } from "./CosmicBackground";
import { HeroState } from "./HeroState";
import { InputBar } from "./InputBar";
import { MessageFeed } from "./MessageFeed";
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
      className="flex h-screen w-full overflow-hidden"
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
        <header className="flex items-center justify-between px-6 py-5">
          <h2 className="font-display text-sm tracking-[0.28em] text-muted-foreground uppercase">
            Nebula AI
          </h2>
          <div className="flex items-center gap-4">
            <AuthButton user={chat.user} />
            <span className="rounded-full border border-border px-3 py-1 text-[11px] tracking-widest text-accent uppercase">
              Deep field
            </span>
          </div>
        </header>

        {chat.isHero ? (
          <HeroState onPick={chat.sendMessage} />
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
