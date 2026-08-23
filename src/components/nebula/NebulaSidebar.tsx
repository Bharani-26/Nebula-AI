import { motion } from "framer-motion";
import { PanelLeftClose, Plus, Settings, Sparkle } from "lucide-react";

import mark from "@/assets/nebula-mark.png";
import type { ChatThread } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";

interface NebulaSidebarProps {
  open: boolean;
  onToggle: () => void;
  threads: ChatThread[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
}

export function NebulaSidebar({
  open,
  onToggle,
  threads,
  activeId,
  onNewChat,
  onSelect,
}: NebulaSidebarProps) {
  return (
    <motion.aside
      animate={{ x: open ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col overflow-hidden border-y-0 border-l-0"
    >
      <div className="flex items-center gap-3 px-4 py-5">
        <img src={mark} alt="Nebula AI" width={32} height={32} className="h-8 w-8 shrink-0" />
        <span className="font-display truncate text-sm font-semibold tracking-[0.24em] uppercase">
          Nebula
        </span>
        <button
          onClick={onToggle}
          aria-label="Collapse sidebar"
          className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-full border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <Plus className="h-4 w-4 shrink-0 text-accent" />
          <span>New chat</span>
        </button>
      </div>

      <div className="cosmic-scroll mt-6 flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Recent orbits
        </p>
        <ul className="space-y-1">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onSelect(t.id)}
                title={t.title}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  activeId === t.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Sparkle className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{t.title}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {t.subtitle}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-nebula)" }}
          >
            BP
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">Bharani</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              Explorer tier
            </span>
          </span>
          <button
            aria-label="Settings"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
