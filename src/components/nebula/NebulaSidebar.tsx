import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, Plus, Settings, Sparkle, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import mark from "@/assets/nebula-mark.png";
import type { ChatThread } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signInWithGoogle, signOut } from "@/lib/supabase";

interface NebulaSidebarProps {
  open: boolean;
  onToggle: () => void;
  threads: ChatThread[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  user?: User | null;
}

export function NebulaSidebar({
  open,
  onToggle,
  threads,
  activeId,
  onNewChat,
  onSelect,
  user,
}: NebulaSidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "Bharani";
  const avatarUrl = user?.user_metadata?.["avatar_url"];
  const email = user?.email || "No email linked";
  const initial = displayName.charAt(0).toUpperCase();

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

      {/* Pinned Profile Section at Bottom Left */}
      <div ref={dropdownRef} className="relative mt-auto border-t border-border p-3">
        <AnimatePresence>
          {isProfileOpen && (
            <>
              {/* Outer backdrop to close popup when clicking outside */}
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                onClick={() => setIsProfileOpen(false)}
              />

              {/* Profile Popup Menu */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-16 left-3 z-50 w-64 rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
              >
                <div className="flex flex-col items-center border-b border-neutral-800 pb-3 text-center">
                  <Avatar className="h-12 w-12 ring-2 ring-teal-500/50 ring-offset-2 ring-offset-background">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-emerald-600 text-lg font-semibold text-white">
                      {initial}
                    </AvatarFallback>
                  </Avatar>

                  <p className="mt-2.5 w-full truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="w-full truncate text-xs text-neutral-400">{email}</p>
                </div>

                <div className="mt-3">
                  {user ? (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signInWithGoogle();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 transition-all duration-200 hover:bg-teal-500/20"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Profile Card Button */}
        <div
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/80"
        >
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-teal-500/60 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-teal-400 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.4)]">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-teal-600 to-emerald-600 text-xs font-semibold text-white">
              {initial}
            </AvatarFallback>
          </Avatar>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              {displayName}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              Explorer tier
            </span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
            }}
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

