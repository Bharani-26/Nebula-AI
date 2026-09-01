// src/components/nebula/ModelSelector.tsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODELS, type ModelConfig } from "@/config/models";

interface ModelSelectorProps {
  selectedModel: ModelConfig;
  onSelectModel: (model: ModelConfig) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#model-selector")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div id="model-selector" className="relative shrink-0 self-center">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-transparent px-2 py-1 text-xs font-medium text-neutral-300 shadow-none transition-colors hover:bg-white/5 hover:text-white"
      >
        <span>{selectedModel.name}</span>
        <svg
          className={`h-3.5 w-3.5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-3 right-0 z-50 min-w-[200px] bg-[#181124] border border-neutral-700/80 rounded-2xl shadow-2xl p-1.5 overflow-hidden"
          >
            {MODELS.map((model) => (
              <li key={model.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectModel(model);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition-colors ${
                    model.id === selectedModel.id
                      ? "bg-purple-500/20 font-medium text-white"
                      : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{model.name}</span>
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      model.provider === "gemini"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
