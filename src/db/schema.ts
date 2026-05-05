import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  date,
  time,
  uuid,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";

/* ==========================================================================
   Instagram - posts du feed (synchronisés via cron toutes les 30 min)
   ========================================================================== */
export const igPosts = pgTable(
  "ig_posts",
  {
    id: text("id").primaryKey(),
    mediaType: text("media_type").notNull(), // IMAGE | VIDEO | CAROUSEL_ALBUM
    mediaUrl: text("media_url").notNull(),
    permalink: text("permalink").notNull(),
    caption: text("caption"),
    thumbnailUrl: text("thumbnail_url"),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ig_posts_timestamp_idx").on(t.timestamp)],
);

/* ==========================================================================
   Instagram - highlights (groupes de stories à la une)
   ========================================================================== */
export const igHighlights = pgTable("ig_highlights", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  coverUrl: text("cover_url"),
  items: jsonb("items").$type<Array<{
    id: string;
    media_type: string;
    media_url: string;
    thumbnail_url?: string;
    timestamp: string;
  }>>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ==========================================================================
   Disponibilités récurrentes (par jour de la semaine)
   ========================================================================== */
export const availabilityRules = pgTable("availability_rules", {
  id: serial("id").primaryKey(),
  weekday: integer("weekday").notNull(), // 0 = dimanche … 6 = samedi
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  slotDuration: integer("slot_duration").notNull().default(30), // minutes
  enabled: boolean("enabled").notNull().default(true),
});

/* ==========================================================================
   Dates bloquées (vacances, jours off ponctuels)
   ========================================================================== */
export const blockedDates = pgTable("blocked_dates", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  reason: text("reason"),
});

/* ==========================================================================
   Réservations
   ========================================================================== */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    vehicleInfo: text("vehicle_info"),
    pickupAddress: text("pickup_address"),
    dropoffAddress: text("dropoff_address"),
    notes: text("notes"),
    status: text("status").notNull().default("pending"), // pending | confirmed | cancelled
    locale: text("locale").notNull().default("fr"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("bookings_starts_at_idx").on(t.startsAt)],
);

export type IgPost = typeof igPosts.$inferSelect;
export type IgHighlight = typeof igHighlights.$inferSelect;
export type AvailabilityRule = typeof availabilityRules.$inferSelect;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
