import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import LabUploadModal from "@/components/LabUploadModal";
import {
  Sparkles,
  Activity,
  FileText,
  Brain,
  Upload,
  Stethoscope,
  AlertTriangle,
  ArrowRight,
  Check,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type T = Record<Lang, string>;
const t = (en: string, ru: string, hy: string): T => ({ en, ru, hy });

const copy = {
  badge: t("AI Powered", "На базе ИИ", "AI-ի հիման վրա"),
  title: t(
    "AI-Based Lab Results Interpretation",
    "Интерпретация анализов с помощью ИИ",
    "Անալիզների վերծանում AI-ի օգնությամբ"
  ),
  subtitle: t(
    "Understand your lab results clearly with AI assistance.",
    "Понимайте свои анализы яснее с помощью ИИ.",
    "Հասկացեք ձեր անալիզները ավելի պարզ՝ AI-ի օգնությամբ:"
  ),
  body: t(
    "Get a preliminary interpretation of your laboratory results using advanced digital algorithms. Receive clear explanations and insights to better understand your health.",
    "Получите предварительную интерпретацию ваших лабораторных результатов с помощью современных цифровых алгоритмов. Ясные объяснения помогут лучше понять ваше здоровье.",
    "Ստացեք ձեր լաբորատոր արդյունքների նախնական մեկնաբանությունը ժամանակակից թվային ալգորիթմների միջոցով: Պարզ բացատրությունները կօգնեն ավելի լավ հասկանալ ձեր առողջությունը:"
  ),
  features: [
    {
      icon: Activity,
      title: t("Normal Range Check", "Проверка нормальных значений", "Նորմայի ստուգում"),
      desc: t(
        "Identify whether your results are within normal ranges.",
        "Определите, находятся ли ваши результаты в пределах нормы.",
        "Պարզեք՝ ձեր արդյունքները նորմայի սահմաններում են:"
      ),
    },
    {
      icon: FileText,
      title: t("Clear Explanation", "Ясное объяснение", "Պարզ բացատրություն"),
      desc: t(
        "Simple, easy-to-understand explanation of any abnormalities.",
        "Простое и понятное объяснение любых отклонений.",
        "Պարզ և հասկանալի բացատրություն ցանկացած շեղման համար:"
      ),
    },
    {
      icon: Brain,
      title: t("Possible Causes", "Возможные причины", "Հնարավոր պատճառներ"),
      desc: t(
        "Insights into potential causes and related conditions.",
        "Информация о возможных причинах и связанных состояниях.",
        "Տեղեկատվություն հնարավոր պատճառների և հարակից վիճակների մասին:"
      ),
    },
  ],
  warningTitle: t("Important", "Важно", "Կարևոր"),
  warning: t(
    "This service is for informational purposes only and does not replace a medical consultation. For diagnosis and treatment, please consult a healthcare professional.",
    "Эта услуга носит исключительно информационный характер и не заменяет медицинскую консультацию. Для диагностики и лечения обратитесь к врачу.",
    "Այս ծառայությունը կրում է բացառապես տեղեկատվական բնույթ և չի փոխարինում բժշկական խորհրդատվությանը: Ախտորոշման և բուժման համար դիմեք բժշկի:"
  ),
  cta1: t("Upload Your Lab Results", "Загрузить анализы", "Վերբեռնել անալիզները"),
  cta2: t("Consult a Doctor", "Консультация врача", "Խորհրդատվություն բժշկի հետ"),
  helper: t(
    "If needed, continue with an online consultation for a personalized evaluation.",
    "При необходимости продолжите онлайн-консультацией для персональной оценки.",
    "Անհրաժեշտության դեպքում շարունակեք առցանց խորհրդատվությամբ՝ անհատական գնահատման համար:"
  ),
  // Lab card
  reportTitle: t("Lab Report", "Результаты анализов", "Անալիզների արդյունք"),
  patient: t("Patient #2847", "Пациент #2847", "Պացիենտ #2847"),
  analyzed: t("Analyzed by AI", "Проанализировано ИИ", "Վերլուծված AI-ի կողմից"),
  insightTitle: t("AI Insight", "Анализ ИИ", "AI-ի վերլուծություն"),
  insightBody: t(
    "Glucose slightly elevated. Recommend follow-up.",
    "Глюкоза немного повышена. Рекомендуется наблюдение.",
    "Գլյուկոզը մի փոքր բարձր է: Խորհուրդ է տրվում հսկողություն:"
  ),
  normal: t("Normal", "Норма", "Նորմա"),
  high: t("High", "Высокий", "Բարձր"),
  low: t("Low", "Низкий", "Ցածր"),
};

const labRows = [
  { name: "Hemoglobin", value: "14.2", unit: "g/dL", status: "normal" as const },
  { name: "Glucose", value: "118", unit: "mg/dL", status: "high" as const },
  { name: "TSH", value: "2.1", unit: "mIU/L", status: "normal" as const },
  { name: "Vitamin D", value: "18", unit: "ng/mL", status: "low" as const },
  { name: "Cholesterol", value: "185", unit: "mg/dL", status: "normal" as const },
];

const AILabInterpretationSection = () => {
  const { lang } = useLang();
  const [uploadOpen, setUploadOpen] = useState(false);

  const statusLabel = {
    normal: copy.normal[lang],
    high: copy.high[lang],
    low: copy.low[lang],
  };

  return (
    <section id="ai-lab-results" className="py-20 relative overflow-hidden scroll-mt-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-background to-primary/10 -z-10" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10" />

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* AI badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 mb-5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-wide bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {copy.badge[lang]}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              {copy.title[lang]}
            </h2>
            <p className="text-base md:text-lg text-primary/90 font-medium mb-4">
              {copy.subtitle[lang]}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
              {copy.body[lang]}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {copy.features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-1">
                        {f.title[lang]}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.desc[lang]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Warning box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80 leading-relaxed">
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {copy.warningTitle[lang]}:
                </span>{" "}
                {copy.warning[lang]}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="group" onClick={() => setUploadOpen(true)}>
                <Upload size={18} />
                {copy.cta1[lang]}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("consultations")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Stethoscope size={18} />
                {copy.cta2[lang]}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{copy.helper[lang]}</p>
          </motion.div>

          {/* RIGHT: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-3xl blur-2xl" />

              {/* Lab card */}
              <div className="relative rounded-2xl bg-card border border-border/60 shadow-[0_30px_60px_-20px_hsl(var(--primary)/0.3)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {copy.reportTitle[lang]}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {copy.patient[lang]} · 02 May 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">
                      AI
                    </span>
                  </div>
                </div>

                {/* Lab rows */}
                <div className="px-5 py-4 space-y-2.5">
                  {labRows.map((row, i) => {
                    const isNormal = row.status === "normal";
                    const isHigh = row.status === "high";
                    const colorClasses = isNormal
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      : isHigh
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
                    const Icon = isNormal ? Check : isHigh ? TrendingUp : TrendingDown;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">{row.name}</p>
                          <p className="text-[10px] text-muted-foreground">{row.unit}</p>
                        </div>
                        <span className="text-sm font-semibold text-foreground tabular-nums mr-3">
                          {row.value}
                        </span>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${colorClasses}`}
                        >
                          <Icon size={10} />
                          {statusLabel[row.status]}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* AI insight */}
                <div className="mx-5 mb-5 p-3.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                      <Brain size={12} />
                    </div>
                    <p className="text-xs font-semibold text-foreground">{copy.insightTitle[lang]}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">
                    {copy.insightBody[lang]}
                  </p>
                </div>
              </div>

              {/* Floating bubble: chart */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-3 py-2 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <Check size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-foreground leading-tight">
                    3 / 5
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-tight">
                    {copy.normal[lang]}
                  </p>
                </div>
              </motion.div>

              {/* Floating bubble: AI */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                  <Sparkles size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-foreground leading-tight">
                    {copy.analyzed[lang]}
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-tight">2.4s</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <LabUploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </section>
  );
};

export default AILabInterpretationSection;
