import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import cosmos1 from "@/assets/cosmos-1.jpg";
import { StarField } from "./StarField";

const DURATION = 7000;

interface IntroSequenceProps {
  onEnter: () => void;
}

export function IntroSequence({ onEnter }: IntroSequenceProps) {
  const [elapsed, setElapsed] = useState(0);
  const [warping, setWarping] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setElapsed(Math.min(now - start, DURATION));
      if (now - start < DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const progress = elapsed / DURATION;
  const ready = elapsed >= DURATION;

  const enter = () => {
    if (warping) return;
    setWarping(true);
    window.setTimeout(onEnter, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cosmos">
      <motion.img
        src={cosmos1}
        alt="Deep space nebula"
        width={1920}
        height={1080}
        initial={{ scale: 1.02, opacity: 0 }}
        animate={{ scale: warping ? 2.6 : 1.22, opacity: 1 }}
        transition={{
          scale: { duration: warping ? 1.5 : 14, ease: warping ? [0.7, 0, 0.3, 1] : "linear" },
          opacity: { duration: 2 },
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      <StarField count={48} />

      <motion.div
        animate={{ opacity: warping ? 0 : 1, filter: warping ? "blur(14px)" : "blur(0px)" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.6em", y: 18 }}
          animate={{ opacity: 1, letterSpacing: "0.34em", y: 0 }}
          transition={{ duration: 3.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-center text-4xl font-semibold text-nebula sm:text-6xl lg:text-7xl"
          style={{ textShadow: "0 0 70px color-mix(in oklab, var(--plasma) 55%, transparent)" }}
        >
          NEBULA AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.6, delay: 1.6 }}
          className="mt-6 max-w-md text-center text-sm tracking-[0.28em] text-muted-foreground uppercase"
        >
          Calibrating deep field
        </motion.p>

        <div className="mt-14 h-14">
          <AnimatePresence>
            {ready && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={enter}
                className="rounded-full px-9 py-4 text-sm font-semibold tracking-[0.22em] text-primary-foreground uppercase transition-transform duration-500 hover:scale-[1.04]"
                style={{
                  background: "var(--gradient-nebula)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Access the Nebula AI
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <div className="h-px flex-1 overflow-hidden bg-border">
            <div
              className="h-px transition-none"
              style={{
                width: `${progress * 100}%`,
                background: "var(--gradient-nebula)",
                boxShadow: "var(--shadow-halo)",
              }}
            />
          </div>
          <span className="w-10 text-right font-mono text-xs text-muted-foreground">
            {Math.ceil((DURATION - elapsed) / 1000)}s
          </span>
          <button
            onClick={enter}
            className="rounded-full border border-border px-4 py-1.5 text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Skip intro
          </button>
        </div>
      </div>

      <AnimatePresence>
        {warping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, color-mix(in oklab, var(--plasma) 30%, transparent) 35%, var(--cosmos) 78%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
