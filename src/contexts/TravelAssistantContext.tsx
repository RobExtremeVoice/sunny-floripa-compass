import { createContext, useContext, useState } from "react";

interface TravelAssistantContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const TravelAssistantContext = createContext<TravelAssistantContextValue | null>(null);

export const TravelAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TravelAssistantContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
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
