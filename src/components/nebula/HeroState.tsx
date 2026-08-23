import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

interface HeroStateProps {
  onPick: (text: string) => void;
  user: User | null;
}

export function HeroState({ onPick, user }: HeroStateProps) {
  const displayName = user?.user_metadata?.["full_name"] || user?.email || "explorer";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-3xl font-semibold sm:text-5xl"
      >
        <span className="text-nebula">Hello, {displayName}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-4 text-center text-sm text-muted-foreground"
      >
        What would you like to explore today?
      </motion.p>
    </div>
  );
}
