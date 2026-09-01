import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signInWithGoogle, signOut } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);
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

  const displayName = user.user_metadata?.["full_name"] || user.email?.split("@")[0] || "Bharani";
  const avatarUrl = user.user_metadata?.["avatar_url"];
  const email = user.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* Green/teal circular "B" icon avatar button */}
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        aria-label="User account menu"
        className="group relative flex items-center justify-center rounded-full p-0.5 transition-all duration-300 focus:outline-none"
      >
        <Avatar className="h-9 w-9 ring-2 ring-teal-500/60 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-teal-400 group-hover:shadow-[0_0_14px_rgba(20,184,166,0.5)]">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-teal-600 to-emerald-600 font-semibold text-white shadow-inner">
            {initial}
          </AvatarFallback>
        </Avatar>
      </button>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Outer backdrop to close modal when clicking outside */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
              onClick={() => setIsProfileOpen(false)}
            />

            {/* Profile Dropdown Modal */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
            >
              {/* Header user info */}
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

              {/* Red Sign Out Button */}
              <div className="mt-3">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


