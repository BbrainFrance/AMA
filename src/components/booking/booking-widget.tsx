"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Slot {
  start: string;
  end: string;
  label: string;
}

type Step = "date" | "slot" | "form" | "success";

export function BookingWidget() {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const [step, setStep] = useState<Step>("date");

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, startTransition] = useTransition();

  // Charge les jours dispos du mois
  useEffect(() => {
    const monthStr = `${viewMonth.year}-${String(viewMonth.month).padStart(2, "0")}`;
    fetch(`/api/availability?month=${monthStr}`)
      .then((r) => r.json())
      .then((d) => setAvailableDays(new Set(d.days ?? [])))
      .catch(() => setAvailableDays(new Set()));
  }, [viewMonth]);

  // Charge les créneaux du jour sélectionné
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const calendarDays = buildCalendarGrid(viewMonth.year, viewMonth.month);
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(viewMonth.year, viewMonth.month - 1, 1));
  const weekdayLabels = buildWeekdayLabels(locale);

  function changeMonth(delta: number) {
    setViewMonth(({ year, month }) => {
      const next = month + delta;
      if (next < 1) return { year: year - 1, month: 12 };
      if (next > 12) return { year: year + 1, month: 1 };
      return { year, month: next };
    });
  }

  async function submitBooking(formData: FormData) {
    if (!selectedSlot) return;

    const payload = {
      startsAt: selectedSlot.start,
      endsAt: selectedSlot.end,
      customerName: String(formData.get("name") ?? ""),
      customerEmail: String(formData.get("email") ?? ""),
      customerPhone: String(formData.get("phone") ?? ""),
      vehicleInfo: String(formData.get("vehicle") ?? ""),
      pickupAddress: String(formData.get("pickup") ?? ""),
      dropoffAddress: String(formData.get("dropoff") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      locale,
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Request failed");
        }
        setStep("success");
      } catch (e) {
        console.error(e);
        toast.error(t("error"));
      }
    });
  }

  return (
    <div className="border border-white/10 bg-carbon-800/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <Step n={1} active={step === "date"} done={["slot", "form", "success"].includes(step)} label={t("selectDate")} />
        <div className="h-px flex-1 bg-white/10" />
        <Step n={2} active={step === "slot"} done={["form", "success"].includes(step)} label={t("selectSlot")} />
        <div className="h-px flex-1 bg-white/10" />
        <Step n={3} active={step === "form"} done={step === "success"} label={t("form.title")} />
      </div>

      <AnimatePresence mode="wait">
        {step === "date" && (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="p-2 hover:text-racing transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <h3 className="font-display text-lg font-bold capitalize">
                {monthLabel}
              </h3>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="p-2 hover:text-racing transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdayLabels.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={i} />;
                const isAvail = availableDays.has(day.iso);
                const isToday = day.iso === new Date().toISOString().slice(0, 10);
                return (
                  <button
                    key={day.iso}
                    type="button"
                    disabled={!isAvail}
                    onClick={() => {
                      setSelectedDate(day.iso);
                      setSelectedSlot(null);
                      setStep("slot");
                    }}
                    className={cn(
                      "aspect-square flex items-center justify-center text-sm font-mono transition-all relative",
                      isAvail
                        ? "text-foreground hover:bg-racing hover:text-white cursor-pointer"
                        : "text-muted-foreground/30 cursor-not-allowed",
                      isToday && "ring-1 ring-racing",
                    )}
                  >
                    {day.day}
                    {isAvail && (
                      <span className="absolute bottom-1 h-1 w-1 bg-racing" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === "slot" && selectedDate && (
          <motion.div
            key="slot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <button
              type="button"
              onClick={() => setStep("date")}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-racing mb-6"
            >
              <ChevronLeft className="size-3" /> {t("form.back")}
            </button>

            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="size-5 text-racing" />
              <h3 className="font-display text-lg font-bold capitalize">
                {new Intl.DateTimeFormat(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date(selectedDate))}
              </h3>
            </div>

            {loadingSlots ? (
              <p className="text-sm text-muted-foreground">{t("loading")}</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noSlots")}</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("form");
                    }}
                    className={cn(
                      "border border-white/10 bg-carbon-800 px-4 py-3 text-sm font-mono hover:border-racing hover:bg-racing/10 hover:text-racing transition-all",
                      selectedSlot?.start === slot.start && "border-racing bg-racing/10 text-racing",
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === "form" && selectedSlot && (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
            action={submitBooking}
          >
            <button
              type="button"
              onClick={() => setStep("slot")}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-racing mb-2"
            >
              <ChevronLeft className="size-3" /> {t("form.back")}
            </button>

            <div className="flex items-center gap-3 p-3 border border-racing/30 bg-racing/5">
              <Clock className="size-4 text-racing" />
              <span className="text-sm font-mono">
                {new Intl.DateTimeFormat(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(selectedSlot.start))}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("form.name")} *</Label>
                <Input id="name" name="name" required minLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("form.email")} *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("form.phone")} *</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">{t("form.vehicle")}</Label>
                <Input id="vehicle" name="vehicle" placeholder="Ferrari 488 GTB 2019" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup">{t("form.pickup")}</Label>
                <Input id="pickup" name="pickup" placeholder="Cannes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoff">{t("form.dropoff")}</Label>
                <Input id="dropoff" name="dropoff" placeholder="Monaco" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("form.notes")}</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? t("form.submitting") : t("form.submit")}
              <ArrowRight />
            </Button>
          </motion.form>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-racing/10 border border-racing">
              <Check className="size-8 text-racing" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              {t("success.title")}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {t("success.message")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Step({
  n,
  active,
  done,
  label,
}: {
  n: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center text-xs font-mono border transition-all",
          done && "bg-racing border-racing text-white",
          active && !done && "border-racing text-racing",
          !active && !done && "border-white/10 text-muted-foreground",
        )}
      >
        {done ? <Check className="size-3" /> : n}
      </div>
      <span
        className={cn(
          "hidden md:block text-[10px] font-mono uppercase tracking-widest",
          active ? "text-racing" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const offset = (firstDay.getDay() + 6) % 7; // Lundi = 0
  const days: Array<{ day: number; iso: string } | null> = [];

  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ day: d, iso });
  }
  return days;
}

function buildWeekdayLabels(locale: string) {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // Lundi 7 oct 2024 = jour 1
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 9, 7 + i);
    return fmt.format(d).slice(0, 2);
  });
}
