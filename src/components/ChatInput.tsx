import { ArrowUp, BookOpen, Mic, Paperclip, Upload } from "lucide-react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ModelSelector } from "./nebula/ModelSelector";
import type { ModelConfig } from "@/config/models";

export interface ChatInputProps {
  onSend: (text: string, ragEnabled: boolean) => void;
  disabled?: boolean;
  selectedModel?: ModelConfig;
  onSelectModel?: (model: ModelConfig) => void;
  onOpenIngestModal?: () => void;
}

export function ChatInput({
  onSend,
  disabled,
  selectedModel,
  onSelectModel,
  onOpenIngestModal,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [ragEnabled, setRagEnabled] = useState(false);
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
    onSend(value, ragEnabled);
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

  return (
    <div className="px-3 pb-4 sm:px-4 sm:pb-6">
      <form
        onSubmit={submit}
        className={`glass-panel mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[28px] p-2.5 overflow-visible transition-all duration-300 ${
          ragEnabled
            ? "ring-2 ring-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
            : "focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        }`}
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        {/* Left: Document Upload Button */}
        {onOpenIngestModal && (
          <button
            type="button"
            onClick={onOpenIngestModal}
            aria-label="Upload document to Knowledge Base"
            title="Upload document to Knowledge Base"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Upload className="h-4.5 w-4.5" />
          </button>
        )}

        <button
          type="button"
          aria-label="Attach a file"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Message Nebula AI..."
          className="flex-1 bg-transparent border-none outline-none resize-none overflow-hidden whitespace-nowrap text-ellipsis text-sm text-white placeholder-neutral-400 py-1.5 px-2"
        />

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-neutral-700/50 mx-1 self-center" />

        {/* Knowledge Base RAG Toggle Button */}
        <button
          type="button"
          onClick={() => setRagEnabled((prev) => !prev)}
          aria-label="Toggle Knowledge Base Search"
          title={
            ragEnabled ? "Knowledge Base Search: ON (RAG Active)" : "Knowledge Base Search: OFF"
          }
          className={`relative flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all duration-300 ${
            ragEnabled
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
          }`}
        >
          <BookOpen className={`h-4 w-4 ${ragEnabled ? "text-cyan-400 animate-pulse" : ""}`} />
          <span className="hidden sm:inline">RAG</span>
          {ragEnabled && (
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        {/* Model Selector Pill */}
        {selectedModel && onSelectModel && (
          <div className="relative shrink-0">
            <ModelSelector selectedModel={selectedModel} onSelectModel={onSelectModel} />
          </div>
        )}

        {/* Voice Input */}
        <button
          type="button"
          aria-label="Voice input"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
        >
          <Mic className="h-4.5 w-4.5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          aria-label="Send message"
          disabled={!value.trim() || disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-opacity disabled:opacity-35"
          style={{ background: "var(--gradient-nebula)", boxShadow: "var(--shadow-halo)" }}
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      </form>

      <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        {ragEnabled ? (
          <span className="flex items-center gap-1.5 text-cyan-400/90 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Knowledge Base Search is active — responses will be augmented with retrieved document
            context.
          </span>
        ) : (
          <span>Nebula AI is ready — click the Book icon to enable Knowledge Base RAG search.</span>
        )}
      </div>
    </div>
  );
}
