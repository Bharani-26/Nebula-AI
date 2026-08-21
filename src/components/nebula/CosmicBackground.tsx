import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import cosmos1 from "@/assets/cosmos-1.jpg";
import cosmos2 from "@/assets/cosmos-2.jpg";
import cosmos3 from "@/assets/cosmos-3.jpg";
import cosmos4 from "@/assets/cosmos-4.jpg";

const SCENES = [cosmos1, cosmos2, cosmos3, cosmos4];

export function CosmicBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SCENES.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cosmos">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={SCENES[index]}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="animate-ken-burns h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-veil)", backdropFilter: "blur(3px)" }}
      />
    </div>
  );
}
