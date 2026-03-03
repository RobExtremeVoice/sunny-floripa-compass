import { createContext, useContext, useState } from "react";

interface TravelAssistantContextValue {
  isOpen: boolean;
  open: () => void;
  openWithPrompt: (prompt: string) => void;
  close: () => void;
  initialPrompt: string | null;
  clearInitialPrompt: () => void;
}

const TravelAssistantContext = createContext<TravelAssistantContextValue | null>(null);

export const TravelAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  const open = () => setIsOpen(true);

  const openWithPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setInitialPrompt(null);
  };

  const clearInitialPrompt = () => setInitialPrompt(null);

  return (
    <TravelAssistantContext.Provider
      value={{ isOpen, open, openWithPrompt, close, initialPrompt, clearInitialPrompt }}
    >
      {children}
    </TravelAssistantContext.Provider>
  );
};

export const useTravelAssistant = () => {
  const ctx = useContext(TravelAssistantContext);
  if (!ctx) throw new Error("useTravelAssistant must be used inside TravelAssistantProvider");
  return ctx;
};
