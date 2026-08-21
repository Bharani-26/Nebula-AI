import { motion } from "framer-motion";
import { Compass, Orbit, Radio, Telescope } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Telescope,
    title: "Explain a deep field image",
    body: "What am I actually looking at in a 10-day exposure?",
  },
  {
    icon: Orbit,
    title: "Plan a slingshot route",
    body: "Earth to Europa with the least fuel and the most patience.",
  },
  {
    icon: Radio,
    title: "Decode a faint signal",
    body: "Separate a repeating burst from background noise.",
  },
  {
    icon: Compass,
    title: "Name a new world",
    body: "Give me five names for a tidally locked ocean planet.",
  },
];

export function HeroState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-3xl font-semibold sm:text-5xl"
      >
        <span className="text-nebula">Where to next, explorer?</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-4 text-center text-sm text-muted-foreground"
      >
        Ask anything about the universe — or somewhere closer to home.
      </motion.p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.title}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            onClick={() => onPick(s.body)}
            className="glass-panel group rounded-2xl p-5 text-left transition-shadow duration-500 hover:border-primary/50"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            <s.icon className="h-5 w-5 text-accent transition-colors group-hover:text-primary" />
            <p className="mt-4 text-sm font-medium">{s.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
