import { useState, useRef, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Download, ListChecks, X, CheckSquare, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plan-trip`;

// Parse markdown into checklist items
function parseChecklist(markdown: string): string[] {
  const items: string[] = [];
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(?:\d+\.|[-*•])\s+(.+)/);
    if (match) items.push(match[1].replace(/\*\*/g, "").trim());
    else if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
      items.push(`__SECTION__${trimmed.replace(/^#+\s*/, "")}`);
    } else if (/^\*\*.+\*\*$/.test(trimmed) && trimmed.length > 4) {
      items.push(`__SECTION__${trimmed.slice(2, -2)}`);
    }
  }
  return items.filter(Boolean);
}

const TripPlanner = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastPlan = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";
  const hasPlan = lastPlan.length > 100;
  const checklistItems = parseChecklist(lastPlan);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCheckable = checklistItems.filter((i) => !i.startsWith("__SECTION__")).length;

  const handleDownloadPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const dateStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const escaped = JSON.stringify(lastPlan);
    win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Roteiro Florianópolis — VisitFloripa</title>
  <style>
    body{font-family:Georgia,serif;max-width:720px;margin:40px auto;color:#1e293b;line-height:1.7;padding:0 20px}
    h1{color:#f4c025;font-size:1.8rem;border-bottom:3px solid #f4c025;padding-bottom:8px}
    h2,h3{color:#0f172a;margin-top:1.5em}
    ul,ol{padding-left:1.5em}li{margin-bottom:6px}
    .meta{color:#64748b;font-size:.85rem;margin-bottom:24px}
    .footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
    @media print{body{margin:20px}}
  </style>
</head>
<body>
  <h1>🌞 Roteiro Personalizado — Florianópolis</h1>
  <p class="meta">Gerado por VisitFloripa AI · ${dateStr}</p>
  <div id="c"></div>
  <div class="footer">visitfloripa.com.br · Powered by Sunny Floripa Compass</div>
  <script>
    const md=${escaped};
    const h=md
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm,'<h2>$1</h2>')
      .replace(/^# (.+)$/gm,'<h1>$1</h1>')
      .replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>')
      .replace(/\\*(.+?)\\*/g,'<em>$1</em>')
      .replace(/^[-*] (.+)$/gm,'<li>$1</li>')
      .replace(/^\\d+\\. (.+)$/gm,'<li>$1</li>')
      .replace(/\\n\\n/g,'</p><p>');
    document.getElementById('c').innerHTML=h;
    setTimeout(()=>window.print(),300);
  </script>
</body></html>`);
    win.document.close();
  };

  const toggleItem = (idx: number) =>
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const startConversation = async () => {
    setStarted(true);
    setIsLoading(true);
    let assistantSoFar = "";
    try {
      await streamChat({
        messages: [],
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Planeje sua Viagem com IA — Florianópolis" url="/planejar" />
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
            {/* Action bar — PDF + Checklist */}
            <AnimatePresence>
              {hasPlan && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-2 mb-4 flex-wrap"
                >
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow hover:brightness-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </button>
                  <button
                    onClick={() => setShowChecklist(true)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow hover:opacity-90 transition-all"
                  >
                    <ListChecks className="w-4 h-4" />
                    Checklist de Viagem
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
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

      {/* Checklist modal */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4"
            onClick={() => setShowChecklist(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h3 className="font-bold text-lg">Checklist de Viagem</h3>
                  <p className="text-sm text-muted-foreground">
                    {checkedCount} / {totalCheckable} itens concluídos
                  </p>
                </div>
                <button
                  onClick={() => setShowChecklist(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: totalCheckable ? `${(checkedCount / totalCheckable) * 100}%` : "0%" }}
                />
              </div>

              {/* Items */}
              <div className="overflow-y-auto flex-1 p-4 space-y-1">
                {checklistItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Nenhum item encontrado. Complete a conversa para gerar seu checklist.
                  </p>
                ) : (
                  checklistItems.map((item, idx) => {
                    if (item.startsWith("__SECTION__")) {
                      return (
                        <p key={idx} className="text-xs font-bold uppercase tracking-widest text-primary mt-4 mb-1 px-2">
                          {item.replace("__SECTION__", "")}
                        </p>
                      );
                    }
                    const checked = !!checkedItems[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleItem(idx)}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        {checked
                          ? <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          : <Square className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        }
                        <span className={`text-sm leading-relaxed ${checked ? "line-through text-muted-foreground" : ""}`}>
                          {item}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-slate-900 py-3 rounded-xl font-bold text-sm hover:brightness-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
                <button
                  onClick={() => setCheckedItems({})}
                  className="px-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Limpar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    if (resp.status === 429) { toast.error("Muitas requisições. Aguarde um momento."); throw new Error("Rate limited"); }
    if (resp.status === 402) { toast.error("Créditos de IA esgotados."); throw new Error("Payment required"); }
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
      if (jsonStr === "[DONE]") { streamDone = true; break; }
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

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw || !raw.startsWith("data: ")) continue;
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
