// src/components/nebula/ModelSelector.tsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODELS, type ModelConfig } from "@/config/models";
import { useChatStore } from "@/hooks/useChatStore";

export function ModelSelector() {
  const { selectedModel, setModel } = useChatStore();
  const [open, setOpen] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#model-selector")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div id="model-selector" className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 rounded-full bg-neutral-900/80 px-3 py-2 text-sm text-primary-foreground shadow-glow transition-colors hover:bg-neutral-800/80"
      >
        <span>{selectedModel.name}</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 w-56 space-y-1 rounded-lg bg-neutral-900/90 py-2 shadow-xl backdrop-blur"
          >
            {MODELS.map((model) => (
              <li key={model.id}>
                <button
                  onClick={() => {
                    setModel(model);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-1 text-left text-sm text-primary-foreground hover:bg-neutral-800/80 ${
                    model.id === selectedModel.id ? "font-medium" : ""
                  }`}
                >
                  <span>{model.name}</span>
                  <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {model.badge}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
