import { useState } from "react";
import { motion } from "framer-motion";
import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import {
  Brain,
  Calculator,
  TrendingUp,
  Activity,
  HeartPulse,
  CalendarDays,
  Stethoscope,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

type T = Record<Lang, string>;
const t = (en: string, ru: string, hy: string): T => ({ en, ru, hy });

const copy = {
  badge: t("4-week structured program", "4-недельная структурированная программа", "4-շաբաթյա կառուցվածքային ծրագիր"),
  title: t("Insulin Dose Training Program", "Программа обучения дозированию инсулина", "Ինսուլինի դեղաչափի ուսուցման ծրագիր"),
  subtitle: t(
    "Learn how to manage insulin safely and confidently in real life.",
    "Научитесь безопасно и уверенно управлять инсулином в повседневной жизни.",
    "Սովորեք անվտանգ և վստահությամբ կառավարել ինսուլինը առօրյա կյանքում:"
  ),
  intro: t(
    "A 4-week structured program designed to help you understand insulin, calculate doses correctly, and manage real-life situations with confidence.",
    "Структурированная 4-недельная программа поможет понять инсулин, правильно рассчитывать дозы и уверенно справляться с реальными ситуациями.",
    "4-շաբաթյա կառուցվածքային ծրագիրը կօգնի հասկանալ ինսուլինը, ճիշտ հաշվարկել դեղաչափերը և վստահությամբ կառավարել իրական իրավիճակները:"
  ),
  module: t("Module", "Модуль", "Մոդուլ"),
  week: t("Week", "Неделя", "Շաբաթ"),
  cta1: t("Start Training Program", "Начать обучение", "Սկսել ուսուցումը"),
  cta2: t("Talk to a Specialist", "Поговорить со специалистом", "Խոսել մասնագետի հետ"),
  helper: t(
    "Guided by medical professionals. Designed for real-life use.",
    "Под руководством медицинских специалистов. Создано для реальной жизни.",
    "Բժշկական մասնագետների ուղեկցությամբ: Ստեղծված է իրական կյանքի համար:"
  ),
  modules: [
    {
      icon: Brain,
      title: t("Foundations", "Основы", "Հիմունքներ"),
      points: [
        t("Types of insulin", "Типы инсулина", "Ինսուլինի տեսակները"),
        t("Basal vs bolus", "Базальный vs болюсный", "Բազալ ընդդեմ բոլուս"),
        t("How insulin works in the body", "Как инсулин работает в организме", "Ինչպես է ինսուլինը գործում օրգանիզմում"),
      ],
    },
    {
      icon: Calculator,
      title: t("Carbohydrates & Counting", "Углеводы и подсчёт", "Ածխաջրեր և հաշվարկ"),
      points: [
        t("What are carbohydrate units", "Что такое хлебные единицы", "Ի՞նչ են ածխաջրային միավորները"),
        t("How to count in real meals", "Как считать в реальных блюдах", "Ինչպես հաշվել իրական ուտեստներում"),
        t("Hidden carbohydrates", "Скрытые углеводы", "Թաքնված ածխաջրեր"),
      ],
    },
    {
      icon: TrendingUp,
      title: t("Dose Calculation", "Расчёт дозы", "Դեղաչափի հաշվարկ"),
      points: [
        t("Carb ratio (ICR)", "Углеводный коэффициент (ICR)", "Ածխաջրային գործակից (ICR)"),
        t("Correction factor (ISF)", "Фактор коррекции (ISF)", "Շտկման գործոն (ISF)"),
        t("Target values", "Целевые значения", "Թիրախային արժեքներ"),
      ],
    },
    {
      icon: Activity,
      title: t("Real-Life Situations", "Реальные ситуации", "Իրական իրավիճակներ"),
      points: [
        t("Eating out / social situations", "Питание вне дома / социальные ситуации", "Ուտել դրսում / սոցիալական իրավիճակներ"),
        t("Physical activity", "Физическая активность", "Ֆիզիկական ակտիվություն"),
        t("Stress & illness", "Стресс и болезнь", "Սթրես և հիվանդություն"),
      ],
    },
    {
      icon: HeartPulse,
      title: t("Hypoglycemia", "Гипогликемия", "Հիպոգլիկեմիա"),
      points: [
        t("Causes", "Причины", "Պատճառներ"),
        t("Prevention & management", "Профилактика и управление", "Կանխարգելում և կառավարում"),
      ],
    },
  ],
};

const InsulinTrainingSection = () => {
  const { lang } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const totalModules = copy.modules.length;

  return (
    <section id="insulin-training" className="py-24 relative overflow-hidden scroll-mt-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-primary/5 -z-10" />
      <div className="absolute top-32 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-32 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl -z-10" />

      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <CalendarDays size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">
              {copy.badge[lang]}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
            {copy.title[lang]}
          </h2>
          <p className="text-base md:text-lg text-primary/90 font-medium mb-3 max-w-2xl mx-auto">
            {copy.subtitle[lang]}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {copy.intro[lang]}
          </p>
        </motion.div>

        {/* Week progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          {[1, 2, 3, 4].map((w) => (
            <div key={w} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-primary/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {copy.week[lang]} {w}
                </span>
              </div>
              {w < 4 && <div className="w-6 h-px bg-primary/30" />}
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line (desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />
          {/* Mobile connecting line */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />

          <div className="space-y-8 md:space-y-10">
            {copy.modules.map((m, i) => {
              const Icon = m.icon;
              const isLeft = i % 2 === 0;
              const num = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative flex md:items-center gap-6 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Module card */}
                  <div className="flex-1 md:max-w-[calc(50%-2rem)] pl-16 md:pl-0">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group rounded-2xl bg-card border border-border/60 p-6 shadow-md hover:shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.25)] hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground transition-all">
                            <Icon size={22} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                              {copy.module[lang]} {num}
                            </p>
                            <h3 className="text-xl font-heading font-bold text-foreground leading-tight">
                              {m.title[lang]}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-1">
                        {m.points.map((p, j) => (
                          <li key={j} className="flex items-start gap-2 text-base text-muted-foreground">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="leading-relaxed">{p[lang]}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Center node */}
                  <div className="absolute md:relative left-0 md:left-auto top-6 md:top-auto md:flex-shrink-0 md:w-16 flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-md" />
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-heading font-bold text-sm shadow-lg border-4 border-background">
                        {num}
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer on opposite side */}
                  <div className="hidden md:block flex-1 md:max-w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20 shadow-lg max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-md">
              <GraduationCap size={26} />
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              {copy.helper[lang]}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button size="lg" className="group" onClick={() => setBookingOpen(true)}>
                {copy.cta1[lang]}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setBookingOpen(true)}>
                <Stethoscope size={18} />
                {copy.cta2[lang]}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} serviceTitle={copy.title[lang]} serviceTitleI18n={copy.title} />
    </section>
  );
};

export default InsulinTrainingSection;
