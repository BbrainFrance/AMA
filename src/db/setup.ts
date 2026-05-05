import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL absent");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const statements = [
  `CREATE TABLE IF NOT EXISTS "ig_posts" (
    "id" text PRIMARY KEY NOT NULL,
    "media_type" text NOT NULL,
    "media_url" text NOT NULL,
    "permalink" text NOT NULL,
    "caption" text,
    "thumbnail_url" text,
    "timestamp" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS "ig_posts_timestamp_idx" ON "ig_posts" ("timestamp")`,

  `CREATE TABLE IF NOT EXISTS "ig_highlights" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "cover_url" text,
    "items" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "availability_rules" (
    "id" serial PRIMARY KEY NOT NULL,
    "weekday" integer NOT NULL,
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "slot_duration" integer DEFAULT 30 NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "blocked_dates" (
    "id" serial PRIMARY KEY NOT NULL,
    "date" date NOT NULL,
    "reason" text,
    CONSTRAINT "blocked_dates_date_unique" UNIQUE("date")
  )`,

  `CREATE TABLE IF NOT EXISTS "bookings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "customer_name" text NOT NULL,
    "customer_email" text NOT NULL,
    "customer_phone" text NOT NULL,
    "vehicle_info" text,
    "pickup_address" text,
    "dropoff_address" text,
    "notes" text,
    "status" text DEFAULT 'pending' NOT NULL,
    "locale" text DEFAULT 'fr' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS "bookings_starts_at_idx" ON "bookings" ("starts_at")`,
];

async function setup() {
  console.log("→ Création des tables sur Neon…");
  for (const stmt of statements) {
    const preview = stmt.split("\n")[0].slice(0, 80);
    process.stdout.write(`  ${preview}…`);
    try {
      await pool.query(stmt);
      console.log(" ✓");
    } catch (e) {
      console.log(" ✗");
      console.error(e);
      await pool.end();
      process.exit(1);
    }
  }

  const result = await pool.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log("\n✓ Tables présentes :");
  for (const t of result.rows) console.log(`  • ${t.table_name}`);
  await pool.end();
  process.exit(0);
}

setup().catch((e) => {
  console.error(e);
  process.exit(1);
});
