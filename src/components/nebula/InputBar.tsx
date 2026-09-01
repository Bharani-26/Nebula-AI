import { ChatInput } from "@/components/ChatInput";
import type { ModelConfig } from "@/config/models";

interface InputBarProps {
  onSend: (text: string, ragEnabled?: boolean) => void;
  disabled?: boolean;
  selectedModel: ModelConfig;
  onSelectModel: (model: ModelConfig) => void;
  onOpenIngestModal?: () => void;
}

export function InputBar({
  onSend,
  disabled,
  selectedModel,
  onSelectModel,
  onOpenIngestModal,
}: InputBarProps) {
  return (
    <ChatInput
      onSend={(text, ragEnabled) => onSend(text, ragEnabled)}
      {...(disabled !== undefined ? { disabled } : {})}
      selectedModel={selectedModel}
      onSelectModel={onSelectModel}
      {...(onOpenIngestModal ? { onOpenIngestModal } : {})}
    />
  );
}

