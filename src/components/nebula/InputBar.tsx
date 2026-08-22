import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [value, setValue] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="px-3 pb-4 sm:px-4 sm:pb-6">
      <form
        onSubmit={submit}
        className="glass-panel mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] p-2.5"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <button
          type="button"
          aria-label="Attach a file"
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Message Nebula AI…"
          className="max-h-40 flex-1 resize-none bg-transparent py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none"
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
