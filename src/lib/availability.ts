import { db } from "@/db";
import { availabilityRules, blockedDates, bookings } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  endOfDay,
  isSameDay,
} from "date-fns";

export interface SlotInfo {
  start: string; // ISO
  end: string; // ISO
  label: string; // ex "10:30"
}

/**
 * Calcule les créneaux disponibles pour un jour donné.
 * - Récupère les règles de la weekday
 * - Soustrait les blockedDates
 * - Soustrait les bookings existants (pending + confirmed)
 * - Filtre les créneaux passés si c'est aujourd'hui
 */
export async function getAvailableSlots(dateStr: string): Promise<SlotInfo[]> {
  const date = parseISO(dateStr);
  const weekday = date.getDay();

  // 1. Date bloquée ?
  const blocked = await db
    .select()
    .from(blockedDates)
    .where(eq(blockedDates.date, dateStr))
    .limit(1);
  if (blocked.length > 0) return [];

  // 2. Règles du jour de la semaine
  const rules = await db
    .select()
    .from(availabilityRules)
    .where(
      and(
        eq(availabilityRules.weekday, weekday),
        eq(availabilityRules.enabled, true),
      ),
    );
  if (rules.length === 0) return [];

  // 3. Bookings existants ce jour
  const existingBookings = await db
    .select({
      startsAt: bookings.startsAt,
      endsAt: bookings.endsAt,
      status: bookings.status,
    })
    .from(bookings)
    .where(
      and(
        gte(bookings.startsAt, startOfDay(date)),
        lte(bookings.startsAt, endOfDay(date)),
      ),
    );
  const taken = existingBookings
    .filter((b) => b.status !== "cancelled")
    .map((b) => ({ start: b.startsAt, end: b.endsAt }));

  // 4. Génération des créneaux à partir des règles
  const now = new Date();
  const slots: SlotInfo[] = [];

  for (const rule of rules) {
    const [sh, sm] = rule.startTime.split(":").map(Number);
    const [eh, em] = rule.endTime.split(":").map(Number);

    let cursor = new Date(date);
    cursor.setHours(sh, sm, 0, 0);

    const ruleEnd = new Date(date);
    ruleEnd.setHours(eh, em, 0, 0);

    while (true) {
      const slotEnd = addMinutes(cursor, rule.slotDuration);
      if (isAfter(slotEnd, ruleEnd)) break;

      const isPast = isSameDay(date, now) && isBefore(cursor, now);
      const conflict = taken.some(
        (t) => isBefore(cursor, t.end) && isAfter(slotEnd, t.start),
      );

      if (!isPast && !conflict) {
        slots.push({
          start: cursor.toISOString(),
          end: slotEnd.toISOString(),
          label: format(cursor, "HH:mm"),
        });
      }
      cursor = slotEnd;
    }
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Renvoie pour un mois donné, les jours qui ont au moins 1 créneau libre.
 * (Calcul léger : on regarde juste les rules + blockedDates, pas les bookings.)
 */
export async function getMonthAvailability(year: number, month: number) {
  // month 1-12
  const rules = await db.select().from(availabilityRules).where(eq(availabilityRules.enabled, true));
  const enabledWeekdays = new Set(rules.map((r) => r.weekday));

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const blocked = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        gte(blockedDates.date, format(monthStart, "yyyy-MM-dd")),
        lte(blockedDates.date, format(monthEnd, "yyyy-MM-dd")),
      ),
    );
  const blockedSet = new Set(blocked.map((b) => b.date));

  const today = startOfDay(new Date());
  const available: string[] = [];

  for (let d = 1; d <= monthEnd.getDate(); d++) {
    const date = new Date(year, month - 1, d);
    const dateStr = format(date, "yyyy-MM-dd");
    if (isBefore(date, today)) continue;
    if (!enabledWeekdays.has(date.getDay())) continue;
    if (blockedSet.has(dateStr)) continue;
    available.push(dateStr);
  }

  return available;
}
