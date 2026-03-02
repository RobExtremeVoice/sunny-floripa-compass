import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Send, Bot, User, Sparkles, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plan-trip`;

const TripPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    setStarted(true);
    setIsLoading(true);
    let assistantSoFar = "";

    const initialMessages: Msg[] = [];

    try {
      await streamChat({
        messages: initialMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages([{ role: "assistant", content: assistantSoFar }]);
        },
        onDone: () => setIsLoading(false),
      });
    } catch {
      toast.error("Erro ao iniciar o assistente");
      setIsLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      await streamChat({
        messages: newMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && prev.length > newMessages.length) {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            return [...newMessages, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setIsLoading(false),
      });
    } catch {
      toast.error("Erro ao gerar resposta");
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-28 container mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Planeje sua Viagem com IA" url="/planejar" />
        <SiteHeader />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-ocean flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Planeje com Inteligência Artificial
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Nosso assistente IA cria roteiros personalizados para Florianópolis
                com praias, restaurantes e atividades reais. Entre na sua conta para começar.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-ocean text-primary-foreground hover:opacity-90 text-base px-8 py-6"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Entrar ou Criar Conta
              </Button>
            </motion.div>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Assistente de Viagem IA" url="/planejar" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-8 md:pt-28 md:pb-10 bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary-foreground/70" />
              <span className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">
                Assistente IA
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Planejador de Viagem Inteligente
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Converse com nosso assistente e receba um roteiro personalizado com os melhores
              lugares de Florianópolis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chat area */}
      <section className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">
        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-ocean flex items-center justify-center mb-6 shadow-lg">
              <Bot className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Pronto para planejar sua viagem?
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Vou te fazer algumas perguntas sobre suas preferências e criar um roteiro
              dia-a-dia perfeito para você em Florianópolis.
            </p>
            <Button
              onClick={startConversation}
              size="lg"
              className="bg-gradient-ocean text-primary-foreground hover:opacity-90 text-base px-8 py-6 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Iniciar Planejamento
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "assistant"
                          ? "bg-gradient-ocean text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-border shadow-sm rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-ocean flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="sticky bottom-0 bg-background pt-2 pb-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-ocean text-primary-foreground hover:opacity-90 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    if (resp.status === 429) {
      toast.error("Muitas requisições. Aguarde um momento.");
      throw new Error("Rate limited");
    }
    if (resp.status === 402) {
      toast.error("Créditos de IA esgotados.");
      throw new Error("Payment required");
    }
    throw new Error("Failed to start stream");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export default TripPlanner;
