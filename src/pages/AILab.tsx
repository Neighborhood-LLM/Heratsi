import AILabInterpretationSection from "@/components/AILabInterpretationSection";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { LanguageProvider, useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import insulaLogo from "@/assets/insula-logo-hero.png";

const LANGS: { code: Lang; label: string }[] = [
  { code: "hy", label: "HY" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

const TopBar = () => {
  const { lang, setLang } = useLang();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={insulaLogo} alt="Insula" className="w-7 h-7 rounded-full object-cover" />
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-foreground lowercase">Heratsi</span>
            <span className="text-[8px] font-medium text-muted-foreground tracking-widest uppercase">
              AI Lab
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                lang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

const AILab = () => (
  <LanguageProvider>
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <main className="flex-1 py-10">
        <AILabInterpretationSection />
      </main>
      <AccessibilityWidget />
    </div>
  </LanguageProvider>
);

export default AILab;
