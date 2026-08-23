import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModelSelector } from "./ModelSelector";
import type { ModelConfig } from "@/config/models";

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  selectedModel: ModelConfig;
  onSelectModel: (model: ModelConfig) => void;
  showSuggestions?: boolean;
}

const QUICK_PROMPTS = [
  { label: "Help me code", prompt: "Help me write a function that " },
  { label: "Summarize text", prompt: "Summarize the following text for me: " },
  { label: "Brainstorm ideas", prompt: "Help me brainstorm ideas for " },
];

export function InputBar({
  onSend,
  disabled,
  selectedModel,
  onSelectModel,
  showSuggestions = false,
}: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const fillPrompt = (prompt: string) => {
    setValue(prompt);
    textareaRef.current?.focus();
    requestAnimationFrame(adjustHeight);
  };

  return (
    <div className="px-3 pb-4 sm:px-4 sm:pb-6">
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-auto mb-3 flex max-w-3xl flex-wrap justify-center gap-2"
          >
            {QUICK_PROMPTS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => fillPrompt(chip.prompt)}
                className="rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
              >
                {chip.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={submit}
        className="glass-panel mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] p-2.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <button
          type="button"
          aria-label="Attach a file"
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>
        <ModelSelector selectedModel={selectedModel} onSelectModel={onSelectModel} />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Message Nebula AI…"
          className="max-h-48 flex-1 resize-none bg-transparent py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
        >
          <Mic className="h-4.5 w-4.5" />
        </button>
        <button
          type="submit"
          aria-label="Send message"
          disabled={!value.trim() || disabled}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-primary-foreground transition-opacity disabled:opacity-35"
          style={{ background: "var(--gradient-nebula)", boxShadow: "var(--shadow-halo)" }}
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      </form>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Nebula AI is a visual prototype — responses are simulated.
      </p>
    </div>
  );
}
