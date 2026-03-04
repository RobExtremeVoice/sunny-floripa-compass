import { useTravelAssistant } from "@/contexts/TravelAssistantContext";
import { motion } from "framer-motion";

const AIFab = () => {
  const { open } = useTravelAssistant();

  return (
    <motion.button
      onClick={open}
      className="md:hidden fixed top-[68px] right-4 z-[55] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f4c025 0%, #f59e0b 100%)" }}
      whileTap={{ scale: 0.92 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      aria-label="Planeje sua Viagem com IA"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#f4c025]" />
      <span className="material-symbols-outlined text-slate-900 text-2xl relative z-10">auto_awesome</span>
    </motion.button>
  );
};

export default AIFab;
