// src/components/nebula/ModelSelector.tsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODELS, type ModelConfig } from "@/config/models";

interface ModelSelectorProps {
  selectedModel: ModelConfig;
  onSelectModel: (model: ModelConfig) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

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
    <div id="model-selector" className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:text-sm"
      >
        <span>{selectedModel.name}</span>
        <svg
          className={`h-3.5 w-3.5 transform transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-0 mb-2 w-64 space-y-1 rounded-lg border border-primary/40 bg-cosmos/95 py-2 shadow-xl backdrop-blur"
          >
            {MODELS.map((model) => (
              <li key={model.id}>
                <button
                  onClick={() => {
                    onSelectModel(model);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground hover:bg-primary/20 ${
                    model.id === selectedModel.id ? "bg-primary/10 font-medium" : ""
                  }`}
                >
                  <span>{model.name}</span>
                  <span
                    className={`ml-2 rounded px-1.5 py-0.5 text-xs font-medium ${
                      model.provider === "gemini"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {model.provider === "gemini" ? "Google" : "OpenRouter"}
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
