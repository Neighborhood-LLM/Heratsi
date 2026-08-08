import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, Minus, X, Type, Sun, Moon, ZoomIn } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

type LangLabels = Record<string, Record<string, string>>;

const allLabels: LangLabels = {
  en: {
    title: "Accessibility",
    fontSize: "Font Size",
    highContrast: "High Contrast",
    largeSpacing: "Line Spacing",
    reset: "Reset All",
  },
  ru: {
    title: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u044c",
    fontSize: "\u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430",
    highContrast: "\u0412\u044b\u0441\u043e\u043a\u0438\u0439 \u043a\u043e\u043d\u0442\u0440\u0430\u0441\u0442",
    largeSpacing: "\u041c\u0435\u0436\u0441\u0442\u0440\u043e\u0447\u043d\u044b\u0439 \u0438\u043d\u0442\u0435\u0440\u0432\u0430\u043b",
    reset: "\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0432\u0441\u0451",
  },
  hy: {
    title: "\u0544\u0561\u057f\u0579\u0565\u056c\u056b\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    fontSize: "\u054f\u0561\u057c\u0561\u0579\u0561\u0583",
    highContrast: "\u0532\u0561\u0580\u0571\u0580 \u056f\u0578\u0576\u057f\u0580\u0561\u057d\u057f",
    largeSpacing: "\u054f\u0578\u0572\u0561\u0574\u056b\u057b\u0565\u057e \u0570\u0565\u057c\u0561\u057e\u0578\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    reset: "\u0536\u0580\u0578\u0575\u0561\u0581\u0576\u0565\u056c",
  },
};

type Settings = {
  fontScale: number;
  highContrast: boolean;
  largeSpacing: boolean;
};

const STORAGE_KEY = "insula-a11y";

const defaultSettings: Settings = {
  fontScale: 100,
  highContrast: false,
  largeSpacing: false,
};

const AccessibilityWidget = () => {
  const { lang } = useLang();
  const t = allLabels[lang] || allLabels.en;
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const applySettings = useCallback((s: Settings) => {
    const root = document.documentElement;
    root.style.fontSize = `${s.fontScale}%`;

    if (s.highContrast) {
      root.classList.add("a11y-high-contrast");
    } else {
      root.classList.remove("a11y-high-contrast");
    }

    if (s.largeSpacing) {
      root.classList.add("a11y-large-spacing");
    } else {
      root.classList.remove("a11y-large-spacing");
    }
  }, []);

  useEffect(() => {
    applySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, applySettings]);

  const updateFontScale = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      fontScale: Math.max(80, Math.min(150, prev.fontScale + delta)),
    }));
  };

  const reset = () => setSettings(defaultSettings);

  const isModified =
    settings.fontScale !== 100 || settings.highContrast || settings.largeSpacing;

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={t.title}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={20} /> : <Eye size={20} />}
        {isModified && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-destructive rounded-full" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-72 rounded-2xl bg-card border border-border p-5 space-y-5"
            style={{ boxShadow: "var(--shadow-elevated)" }}
            role="dialog"
            aria-label={t.title}
          >
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 text-base">
              <Eye size={18} className="text-primary" />
              {t.title}
            </h3>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Type size={14} />
                {t.fontSize}: {settings.fontScale}%
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateFontScale(-10)}
                  disabled={settings.fontScale <= 80}
                  className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 disabled:opacity-40 transition-colors"
                  aria-label="Decrease font size"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${((settings.fontScale - 80) / 70) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => updateFontScale(10)}
                  disabled={settings.fontScale >= 150}
                  className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 disabled:opacity-40 transition-colors"
                  aria-label="Increase font size"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={() =>
                setSettings((p) => ({ ...p, highContrast: !p.highContrast }))
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                settings.highContrast
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              {settings.highContrast ? <Sun size={16} /> : <Moon size={16} />}
              {t.highContrast}
            </button>

            {/* Line Spacing */}
            <button
              onClick={() =>
                setSettings((p) => ({ ...p, largeSpacing: !p.largeSpacing }))
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                settings.largeSpacing
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              <ZoomIn size={16} />
              {t.largeSpacing}
            </button>

            {/* Reset */}
            {isModified && (
              <button
                onClick={reset}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {t.reset}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityWidget;
