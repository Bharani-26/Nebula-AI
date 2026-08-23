import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signInWithGoogle, signOut } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => {
          setLoading(true);
          signInWithGoogle().finally(() => setLoading(false));
        }}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border border-primary/70 bg-primary/25 px-4 py-2 text-sm font-semibold text-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_50%,transparent)] transition-colors hover:bg-primary/40 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    );
  }

  const displayName = user.user_metadata?.["full_name"] || user.email || "User";
  const avatarUrl = user.user_metadata?.["avatar_url"];
  const email = user.email || "";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="rounded-full p-0.5 transition-all duration-300 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] focus:shadow-[0_0_12px_rgba(168,85,247,0.4)] focus:outline-none"
      >
        <Avatar className="h-9 w-9 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-background">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-purple-500/20 text-xs font-medium text-purple-300">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-border bg-cosmos/95 p-4 shadow-xl backdrop-blur"
          >
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-purple-500/20 text-sm font-medium text-purple-300">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
