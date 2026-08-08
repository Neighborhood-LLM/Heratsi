import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Video, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLang } from "@/i18n/LanguageContext";
import translations from "@/i18n/translations";
import { toast } from "sonner";
import { postJson } from "@/lib/api";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
  /** Same title in all languages, so it can be logged/displayed localized */
  serviceTitleI18n?: Record<"en" | "ru" | "hy", string>;
  defaultMode?: "online" | "offline";
}

const msg = {
  name: {
    en: "Please enter your full name (2-100 characters)",
    ru: "Введите ваше имя (2-100 символов)",
    hy: "Մուտքագրեք ձեր անունը (2-100 նիշ)",
  },
  phone: {
    en: "Please enter a valid phone number",
    ru: "Введите корректный номер телефона",
    hy: "Մուտքագրեք վավեր հեռախոսահամար",
  },
  date: {
    en: "Please pick a future date",
    ru: "Выберите будущую дату",
    hy: "Ընտրեք ապագա ամսաթիվ",
  },
  pastTime: {
    en: "Please pick a time in the future",
    ru: "Выберите время в будущем",
    hy: "Ընտրեք ապագա ժամ",
  },
  time: {
    en: "Please pick a time",
    ru: "Выберите время",
    hy: "Ընտրեք ժամ",
  },
  email: {
    en: "Please enter a valid email address",
    ru: "Введите корректный адрес эл. почты",
    hy: "Մուտքագրեք վավեր էլ. փոստի հասցե",
  },
  fail: {
    en: "Could not send your request. Please try again.",
    ru: "Не удалось отправить заявку. Попробуйте ещё раз.",
    hy: "Հայտը չհաջողվեց ուղարկել։ Փորձեք կրկին։",
  },
};

const emailLabel = { en: "Email", ru: "Эл. почта", hy: "Էլ. փոստ" };
const timeLabel = { en: "Preferred Time", ru: "Предпочтительное время", hy: "Նախընտրելի ժամ" };
const timePlaceholder = { en: "Pick a time", ru: "Выберите время", hy: "Ընտրեք ժամ" };
const modeLabel = { en: "Appointment Type", ru: "Тип приёма", hy: "Ընդունման տեսակ" };
const modeOptions = {
  online: { en: "Online", ru: "Онлайн", hy: "Օնլայն" },
  offline: { en: "In Clinic", ru: "В клинике", hy: "Կլինիկայում" },
};
const noSlots = {
  en: "No times left today",
  ru: "На сегодня нет свободного времени",
  hy: "Այսօրվա համար ազատ ժամ չկա",
};

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(25).regex(/^[+()\d\s-]+$/),
  email: z.string().trim().email().max(255),
  date: z.string().refine((d) => {
    const picked = new Date(d);
    if (Number.isNaN(picked.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return picked >= today;
  }),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  mode: z.enum(["online", "offline"]),
}).refine(
  (v) => {
    const dt = new Date(`${v.date}T${v.time}:00`);
    return !Number.isNaN(dt.getTime()) && dt.getTime() > Date.now();
  },
  { path: ["pastTime"] }
);

const todayStr = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};

const BookingModal = ({ open, onOpenChange, serviceTitle, serviceTitleI18n, defaultMode = "online" }: BookingModalProps) => {
  const { lang } = useLang();
  const b = translations.services.booking;
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "", mode: defaultMode });
  const [submitting, setSubmitting] = useState(false);

  const today = todayStr();
  const availableSlots =
    form.date === today
      ? TIME_SLOTS.filter((slot) => {
          const [h, m] = slot.split(":").map(Number);
          const d = new Date();
          d.setHours(h, m, 0, 0);
          return d.getTime() > Date.now();
        })
      : TIME_SLOTS;

  useEffect(() => {
    if (form.time && !availableSlots.includes(form.time)) {
      setForm((f) => ({ ...f, time: "" }));
    }
  }, [form.date, form.time, availableSlots]);

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({ ...prev, mode: defaultMode }));
  }, [open, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const titleAll = serviceTitleI18n ?? { en: serviceTitle, ru: serviceTitle, hy: serviceTitle };

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const field = parsed.error.issues[0].path[0] as "name" | "phone" | "email" | "date" | "time" | "pastTime";
      toast.error(msg[field][lang]);
      return;
    }

    setSubmitting(true);
    try {
      await postJson("/api/bookings", {
        ...parsed.data,
        serviceTitle: titleAll.en,
        language: lang,
      });
      toast.success(b.success[lang]);
      setForm({ name: "", phone: "", email: "", date: "", time: "", mode: "online" });
      onOpenChange(false);
    } catch {
      toast.error(msg.fail[lang]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!submitting) onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{b.title[lang]}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{serviceTitle}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{b.name[lang]}</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{b.phone[lang]}</label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={25}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{emailLabel[lang]}</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{modeLabel[lang]}</label>
            <ToggleGroup
              type="single"
              value={form.mode}
              onValueChange={(v) => v && setForm({ ...form, mode: v as "online" | "offline" })}
              className="w-full"
            >
              <ToggleGroupItem value="online" className="flex-1 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <Video size={16} />
                {modeOptions.online[lang]}
              </ToggleGroupItem>
              <ToggleGroupItem value="offline" className="flex-1 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <MapPin size={16} />
                {modeOptions.offline[lang]}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{b.date[lang]}</label>
              <Input
                type="date"
                value={form.date}
                min={today}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{timeLabel[lang]}</label>
              <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={timePlaceholder[lang]} />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      {noSlots[lang]}
                    </SelectItem>
                  ) : (
                    availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {b.submit[lang]}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
