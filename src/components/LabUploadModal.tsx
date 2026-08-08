import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, Check, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Brain, X, Image as ImageIcon, FileText as FileIcon, HeartPulse, GraduationCap, ArrowRight, Stethoscope } from "lucide-react";
import InsulinTrainingModal from "./InsulinTrainingModal";
import MarkerChatModal, { type MarkerContext } from "./MarkerChatModal";
import BookingModal from "./BookingModal";

import doctor1 from "@/assets/doctor-1.jpg";
import { useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import { postJson } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
// Use the bundled worker so it works without external CDN config
// @ts-ignore - vite ?url import
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type T = Record<Lang, string>;
const t = (en: string, ru: string, hy: string): T => ({ en, ru, hy });

interface LabRow {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  status: "normal" | "high" | "low" | "unknown";
  explanation?: string;
}
type ServiceId = "t2d-control" | "t2d-premium" | "t1d-pregnancy" | "gestational-diabetes" | "hypothyroid-pregnancy" | "nutrition";
type ProgramId = "edu-t1d" | "edu-t2d" | "insulin-calc" | "weight-loss" | "pregnancy-nutrition";
type DoctorId = "anna-sarkisian";

interface Analysis {
  summary: string;
  rows: LabRow[];
  insights: string[];
  recommendation: string;
  disclaimer: string;
  recommendedServices?: ServiceId[];
  recommendedPrograms?: ProgramId[];
  recommendedDoctors?: DoctorId[];
}

const doctorsCatalog: Record<DoctorId, { id: number; name: T; specialty: T; image: string }> = {
  "anna-sarkisian": {
    id: 1,
    name: t("Anna Sarkisian", "Анна Саркисян", "Աննա Սարգսյան"),
    specialty: t("Endocrinologist, PhD · 19+ years", "Эндокринолог, к.м.н. · 19+ лет", "Էնդոկրինոլոգ, բ.գ.թ. · 19+ տարի"),
    image: doctor1,
  },
};

const servicesCatalog: Record<ServiceId, { name: T; desc: T }> = {
  "t2d-control": {
    name: t("Type 2 Diabetes Control", "Контроль диабета 2 типа", "2-րդ տիպի շաքարախտի վերահսկում"),
    desc: t("3-month program with consultations and therapy adjustment.", "3-месячная программа с консультациями и коррекцией терапии.", "3-ամսյա ծրագիր՝ խորհրդատվությամբ և բուժման ճշգրտմամբ:"),
  },
  "t2d-premium": {
    name: t("Type 2 Diabetes — Premium", "Диабет 2 типа — Premium", "2-րդ տիպի շաքարախտ — Premium"),
    desc: t("6-month premium program with deeper coaching.", "6-месячная премиум-программа с глубоким сопровождением.", "6-ամսյա պրեմիում ծրագիր՝ խորը ուղեկցմամբ:"),
  },
  "t1d-pregnancy": {
    name: t("Type 1 Diabetes & Pregnancy", "Диабет 1 типа при беременности", "1-ին տիպի շաքարախտ և հղիություն"),
    desc: t("Full pregnancy supervision with CGM and insulin adjustment.", "Полное сопровождение беременности с CGM и коррекцией инсулина.", "Հղիության ամբողջական ուղեկցում CGM-ով:"),
  },
  "gestational-diabetes": {
    name: t("Gestational Diabetes", "Гестационный диабет", "Գեստացիոն շաքարախտ"),
    desc: t("Personalized care plan with nutrition and glucose control.", "Индивидуальный план с контролем питания и глюкозы.", "Անհատական պլան՝ սննդի և գլյուկոզայի վերահսկմամբ:"),
  },
  "hypothyroid-pregnancy": {
    name: t("Hypothyroidism & Pregnancy", "Гипотиреоз и беременность", "Հիպոթիրեոզ և հղիություն"),
    desc: t("Thyroid monitoring and therapy adjustment by trimester.", "Мониторинг щитовидной железы и коррекция терапии.", "Վահանաձև գեղձի մոնիտորինգ և բուժման ճշգրտում:"),
  },
  "nutrition": {
    name: t("Personalized Nutrition", "Персонализированная нутрициология", "Անհատականացված սննդաբանություն"),
    desc: t("Custom meal plan and lifestyle coaching.", "Индивидуальный план питания и сопровождение.", "Անհատական սննդի պլան և ուղեկցում:"),
  },
};

const programsCatalog: Record<ProgramId, { name: T; desc: T }> = {
  "edu-t1d": {
    name: t("Type 1 Diabetes Education", "Обучение при диабете 1 типа", "Ուսուցում 1-ին տիպի շաքարախտի դեպքում"),
    desc: t("8-module course for people with type 1 diabetes.", "8-модульный курс для людей с диабетом 1 типа.", "8-մոդուլանոց դասընթաց:"),
  },
  "edu-t2d": {
    name: t("Type 2 Diabetes Education", "Обучение при диабете 2 типа", "Ուսուցում 2-րդ տիպի շաքարախտի դեպքում"),
    desc: t("8-module course for people with type 2 diabetes.", "8-модульный курс для людей с диабетом 2 типа.", "8-մոդուլանոց դասընթաց:"),
  },
  "insulin-calc": {
    name: t("Insulin Dose Calculation", "Расчёт инсулина", "Ինսուլինի դոզայի հաշվարկ"),
    desc: t("5-module course on insulin types, ICR, ISF and real-life dosing.", "5-модульный курс по типам инсулина, ICR, ISF и расчётам в реальных ситуациях.", "5-մոդուլանոց դասընթաց:"),
  },
  "weight-loss": {
    name: t("Weight Loss & Metabolic Health", "Снижение веса и метаболическое здоровье", "Քաշի կորուստ և մետաբոլիկ առողջություն"),
    desc: t("7-module program for sustainable metabolic health.", "7-модульная программа для устойчивого метаболического здоровья.", "7-մոդուլանոց ծրագիր:"),
  },
  "pregnancy-nutrition": {
    name: t("Nutrition During Pregnancy", "Питание при беременности", "Սնունդը հղիության ընթացքում"),
    desc: t("4-module program on nutrition during pregnancy.", "4-модульная программа по питанию при беременности.", "4-մոդուլանոց ծրագիր:"),
  },
};

const copy = {
  title: t("Upload Your Lab Results", "Загрузите ваши анализы", "Վերբեռնել ձեր անալիզները"),
  desc: t(
    "Upload a photo or PDF screenshot. Our AI will provide a preliminary explanation.",
    "Загрузите фото или скриншот PDF. ИИ даст предварительное объяснение.",
    "Վերբեռնեք լուսանկար կամ PDF-ի սքրինշոթ: AI-ն կտա նախնական բացատրություն:"
  ),
  drop: t("Click or drag file here", "Нажмите или перетащите файл сюда", "Սեղմեք կամ քաշեք ֆայլը այստեղ"),
  formats: t("PNG, JPG or PDF up to 10 MB", "PNG, JPG или PDF до 10 МБ", "PNG, JPG կամ PDF մինչև 10 ՄԲ"),
  preparingPdf: t("Preparing PDF…", "Подготовка PDF…", "PDF-ի պատրաստում…"),
  pages: t("pages", "стр.", "էջ"),
  errorPdf: t("Could not read this PDF.", "Не удалось прочитать PDF.", "Չհաջողվեց կարդալ PDF-ը:"),
  analyze: t("Analyze with AI", "Проанализировать", "Վերլուծել AI-ի միջոցով"),
  analyzing: t("Analyzing your results…", "Анализируем ваши результаты…", "Վերլուծվում են ձեր արդյունքները…"),
  remove: t("Remove", "Удалить", "Հեռացնել"),
  newUpload: t("Upload another", "Загрузить другие", "Վերբեռնել ուրիշ"),
  summary: t("Summary", "Кратко", "Ամփոփում"),
  markers: t("Detected markers", "Найденные показатели", "Հայտնաբերված ցուցանիշներ"),
  insights: t("AI insights", "Анализ ИИ", "AI-ի վերլուծություն"),
  recommendation: t("Recommendation", "Рекомендация", "Առաջարկ"),
  disclaimer: t("Disclaimer", "Дисклеймер", "Հրաժարում"),
  recServices: t("Recommended services for you", "Рекомендуемые услуги для вас", "Ձեզ համար առաջարկվող ծառայություններ"),
  recPrograms: t("Recommended educational programs", "Рекомендуемые обучающие программы", "Առաջարկվող ուսուցողական ծրագրեր"),
  recIntro: t("Based on your results, these may help:", "На основе ваших результатов могут помочь:", "Ձեր արդյունքների հիման վրա կարող են օգնել՝"),
  viewService: t("View service", "Перейти к услуге", "Անցնել ծառայությանը"),
  viewProgram: t("View program", "Перейти к программе", "Անցնել ծրագրին"),
  recDoctors: t("Recommended doctors", "Рекомендуемые врачи", "Առաջարկվող բժիշկներ"),
  bookDoctor: t("Book consultation", "Записаться", "Գրանցվել"),
  normal: t("Normal", "Норма", "Նորմա"),
  high: t("High", "Высокий", "Բարձր"),
  low: t("Low", "Низкий", "Ցածր"),
  unknown: t("Unknown", "Неизвестно", "Անհայտ"),
  errorBig: t("File is too large (max 10 MB).", "Файл слишком большой (макс. 10 МБ).", "Ֆայլը չափազանց մեծ է (առավելագույնը 10 ՄԲ):"),
  errorType: t("Please upload an image (PNG/JPG) or PDF.", "Загрузите изображение (PNG/JPG) или PDF.", "Վերբեռնեք պատկեր (PNG/JPG) կամ PDF:"),
  errorGeneric: t("Analysis failed. Please try again.", "Не удалось проанализировать. Попробуйте снова.", "Վերլուծությունը ձախողվեց: Փորձեք կրկին:"),
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LabUploadModal = ({ open, onOpenChange }: Props) => {
  const { lang } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]); // image data URLs (1+ for PDFs)
  const [isPdf, setIsPdf] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setFile(null);
    setPreviews([]);
    setIsPdf(false);
    setPreparing(false);
    setAnalysis(null);
    setLoading(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const renderPdfToImages = async (file: File): Promise<string[]> => {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const maxPages = Math.min(pdf.numPages, 10);
    const out: string[] = [];
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      out.push(canvas.toDataURL("image/jpeg", 0.85));
    }
    return out;
  };

  const handleFiles = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const pdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isImage && !pdf) {
      toast({ title: copy.errorType[lang], variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: copy.errorBig[lang], variant: "destructive" });
      return;
    }
    setFile(f);
    setAnalysis(null);
    setIsPdf(pdf);

    if (pdf) {
      setPreparing(true);
      try {
        const imgs = await renderPdfToImages(f);
        setPreviews(imgs);
      } catch (e) {
        console.error(e);
        toast({ title: copy.errorPdf[lang], variant: "destructive" });
        reset();
      } finally {
        setPreparing(false);
      }
    } else {
      const dataUrl = await fileToBase64(f);
      setPreviews([dataUrl]);
    }
  };

  const analyze = async () => {
    if (!file || previews.length === 0) return;
    setLoading(true);
    try {
      const data = await postJson<{ analysis: Analysis }>("/api/analyze-lab-results", {
        images: previews,
        language: lang,
      });
      setAnalysis(data.analysis);
    } catch (e: any) {
      console.error(e);
      toast({ title: copy.errorGeneric[lang], description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = {
    normal: copy.normal[lang],
    high: copy.high[lang],
    low: copy.low[lang],
    unknown: copy.unknown[lang],
  };
  const statusStyles = {
    normal: { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", Icon: Check },
    high: { cls: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", Icon: TrendingUp },
    low: { cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", Icon: TrendingDown },
    unknown: { cls: "bg-muted text-muted-foreground border-border", Icon: AlertTriangle },
  } as const;

  const [insulinModalOpen, setInsulinModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "normal" | "high" | "low" | "unknown">("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMarker, setChatMarker] = useState<MarkerContext | null>(null);
  const askAiLabel = { en: "Explain with AI", ru: "Объяснить с ИИ", hy: "Բացատրել AI-ի միջոցով" }[lang];


  const allLabel = { en: "All", ru: "Все", hy: "Բոլորը" }[lang];
  const noMatchLabel = {
    en: "No markers match this filter.",
    ru: "Нет показателей по этому фильтру.",
    hy: "Այս զտիչին համապատասխան ցուցանիշ չկա:",
  }[lang];

  const filterOptions = (["all", "normal", "high", "low", "unknown"] as const).map((key) => ({
    key,
    label: key === "all" ? allLabel : statusLabel[key],
    count:
      key === "all"
        ? analysis?.rows.length ?? 0
        : analysis?.rows.filter((r) => (r.status ?? "unknown") === key).length ?? 0,
  }));

  const filteredRows =
    analysis?.rows.filter((r) => statusFilter === "all" || (r.status ?? "unknown") === statusFilter) ?? [];

  const goToService = (id: ServiceId) => {
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById("comprehensive-services")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  const goToProgram = (id: ProgramId) => {
    if (id === "insulin-calc") {
      setInsulinModalOpen(true);
      return;
    }
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById("educational-programs")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  const [bookingDoctor, setBookingDoctor] = useState<DoctorId | null>(null);
  const goToDoctor = (id: DoctorId) => {
    setBookingDoctor(id);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            {copy.title[lang]}
          </DialogTitle>
          <DialogDescription>{copy.desc[lang]}</DialogDescription>
        </DialogHeader>

        {/* Upload area */}
        {!analysis && (
          <div className="space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all
                ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/[0.03]"}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf,.pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {preparing ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 size={28} className="animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">{copy.preparingPdf[lang]}</p>
                </div>
              ) : previews.length > 0 ? (
                <div className="relative">
                  {isPdf ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="grid grid-cols-3 gap-2 max-w-sm">
                        {previews.slice(0, 3).map((p, i) => (
                          <img key={i} src={p} alt={`Page ${i + 1}`} className="rounded border border-border max-h-32 object-cover" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileIcon size={14} className="text-primary" />
                        <span>{file?.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                          {previews.length} {copy.pages[lang]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={previews[0]} alt="Lab preview" className="mx-auto max-h-64 rounded-lg shadow-md" />
                      <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                        <ImageIcon size={12} /> {file?.name}
                      </p>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border border-border shadow flex items-center justify-center hover:bg-muted"
                    aria-label={copy.remove[lang]}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{copy.drop[lang]}</p>
                  <p className="text-xs text-muted-foreground">{copy.formats[lang]}</p>
                </div>
              )}
            </div>

            <Button onClick={analyze} disabled={!file || loading || preparing || previews.length === 0} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> {copy.analyzing[lang]}
                </>
              ) : (
                <>
                  <Sparkles size={16} /> {copy.analyze[lang]}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-primary" />
                  <h4 className="text-sm font-semibold">{copy.summary[lang]}</h4>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Markers */}
              {analysis.rows.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-primary" /> {copy.markers[lang]}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {filterOptions.map((opt) => {
                      const active = statusFilter === opt.key;
                      const disabled = opt.count === 0 && opt.key !== "all";
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={disabled}
                          onClick={() => setStatusFilter(opt.key)}
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:bg-secondary"
                          }`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    {filteredRows.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">{noMatchLabel}</p>
                    )}
                    {filteredRows.map((row, i) => {
                      const s = statusStyles[row.status] ?? statusStyles.unknown;
                      const Icon = s.Icon;
                      return (
                        <div key={i} className="p-3 rounded-lg border border-border bg-card">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{row.name}</p>
                              {row.referenceRange && (
                                <p className="text-[10px] text-muted-foreground">
                                  Ref: {row.referenceRange}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-semibold tabular-nums">
                              {row.value} {row.unit ?? ""}
                            </span>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${s.cls}`}>
                              <Icon size={10} />
                              {statusLabel[row.status]}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setChatMarker(row);
                                setChatOpen(true);
                              }}
                              aria-label={askAiLabel}
                              title={askAiLabel}
                              className="shrink-0 w-6 h-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              ?
                            </button>
                          </div>

                          {row.explanation && (
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                              {row.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Insights */}
              {analysis.insights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" /> {copy.insights[lang]}
                  </h4>
                  <ul className="space-y-1.5">
                    {analysis.insights.map((ins, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              {analysis.recommendation && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <span className="font-semibold text-primary">{copy.recommendation[lang]}: </span>
                  <span className="text-foreground/85">{analysis.recommendation}</span>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-foreground/80">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{copy.disclaimer[lang]}: </span>
                  {analysis.disclaimer}
                </span>
              </div>

              {/* Recommended services */}
              {analysis.recommendedServices && analysis.recommendedServices.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <HeartPulse size={14} className="text-primary" /> {copy.recServices[lang]}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">{copy.recIntro[lang]}</p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {analysis.recommendedServices.map((id) => {
                      const item = servicesCatalog[id];
                      if (!item) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => goToService(id)}
                          className="text-left p-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground leading-snug">{item.name[lang]}</p>
                            <ArrowRight size={14} className="text-primary shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc[lang]}</p>
                          <p className="text-[11px] font-semibold text-primary mt-2">{copy.viewService[lang]}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommended programs */}
              {analysis.recommendedPrograms && analysis.recommendedPrograms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" /> {copy.recPrograms[lang]}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">{copy.recIntro[lang]}</p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {analysis.recommendedPrograms.map((id) => {
                      const item = programsCatalog[id];
                      if (!item) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => goToProgram(id)}
                          className="text-left p-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground leading-snug">{item.name[lang]}</p>
                            <ArrowRight size={14} className="text-primary shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc[lang]}</p>
                          <p className="text-[11px] font-semibold text-primary mt-2">{copy.viewProgram[lang]}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommended doctors */}
              {analysis.recommendedDoctors && analysis.recommendedDoctors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Stethoscope size={14} className="text-primary" /> {copy.recDoctors[lang]}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">{copy.recIntro[lang]}</p>
                  <div className="space-y-2.5">
                    {analysis.recommendedDoctors.map((id) => {
                      const doc = doctorsCatalog[id];
                      if (!doc) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => goToDoctor(id)}
                          className="w-full text-left p-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 hover:shadow-md transition-all group flex items-center gap-3"
                        >
                          <img src={doc.image} alt={doc.name[lang]} className="w-12 h-12 rounded-full object-cover border border-border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-snug">{doc.name[lang]}</p>
                            <p className="text-xs text-muted-foreground leading-snug">{doc.specialty[lang]}</p>
                          </div>
                          <span className="text-[11px] font-semibold text-primary inline-flex items-center gap-1 shrink-0">
                            {copy.bookDoctor[lang]}
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button onClick={reset} variant="outline" className="w-full">
                <Upload size={14} /> {copy.newUpload[lang]}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
      <InsulinTrainingModal open={insulinModalOpen} onOpenChange={setInsulinModalOpen} />
      <MarkerChatModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        marker={chatMarker}
        summary={analysis?.summary}
      />
      <BookingModal
        open={bookingDoctor !== null}
        onOpenChange={(o) => !o && setBookingDoctor(null)}
        serviceTitle={bookingDoctor ? doctorsCatalog[bookingDoctor].name[lang] : ""}
        serviceTitleI18n={bookingDoctor ? doctorsCatalog[bookingDoctor].name : undefined}
      />

    </Dialog>
  );
};

export default LabUploadModal;

