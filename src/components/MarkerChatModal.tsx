import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles } from "lucide-react";
import { postJson } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";

export interface MarkerContext {
  name: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  status?: string;
  explanation?: string;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const copy = {
  title: { en: "AI explanation", ru: "Объяснение ИИ", hy: "AI բացատրություն" } as Record<Lang, string>,
  desc: {
    en: "Plain-language explanation of this marker. You can ask follow-up questions.",
    ru: "Простое объяснение показателя. Можно задать уточняющие вопросы.",
    hy: "Այս ցուցանիշի պարզ բացատրությունը: Կարող եք լրացուցիչ հարցեր տալ:",
  } as Record<Lang, string>,
  placeholder: {
    en: "Ask a question…",
    ru: "Задайте вопрос…",
    hy: "Տվեք հարց…",
  } as Record<Lang, string>,
  thinking: { en: "Thinking…", ru: "Думаю…", hy: "Մտածում է…" } as Record<Lang, string>,
  error: {
    en: "Could not get an answer. Please try again.",
    ru: "Не удалось получить ответ. Попробуйте снова.",
    hy: "Չհաջողվեց ստանալ պատասխան: Փորձեք կրկին:",
  } as Record<Lang, string>,
};

const initialPrompt: Record<Lang, (name: string) => string> = {
  en: (n) => `Explain my "${n}" result in simple words.`,
  ru: (n) => `Объясни мой результат «${n}» простыми словами.`,
  hy: (n) => `Բացատրիր իմ «${n}» արդյունքը պարզ բառերով:`,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marker: MarkerContext | null;
  summary?: string;
}

const MarkerChatModal = ({ open, onOpenChange, marker, summary }: Props) => {
  const { lang } = useLang();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedFor = useRef<string | null>(null);

  const send = async (history: ChatMsg[]) => {
    if (!marker) return;
    setLoading(true);
    try {
      const data = await postJson<{ reply: string }>("/api/explain-marker", {
        marker,
        summary,
        messages: history,
        language: lang,
      });
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      console.error(e);
      toast({ title: copy.error[lang], description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !marker) return;
    const key = `${marker.name}|${lang}`;
    if (startedFor.current === key) return;
    startedFor.current = key;
    const first: ChatMsg[] = [{ role: "user", content: initialPrompt[lang](marker.name) }];
    setMessages(first);
    void send(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, marker?.name, lang]);

  useEffect(() => {
    if (!open) startedFor.current = null;
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    void send(next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            {marker?.name} — {copy.title[lang]}
          </DialogTitle>
          <DialogDescription>{copy.desc[lang]}</DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="max-h-[52vh] overflow-y-auto space-y-3 pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
                  : "bg-muted text-foreground max-w-[95%]"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> {copy.thinking[lang]}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 pt-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder[lang]}
            autoFocus
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarkerChatModal;
