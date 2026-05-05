import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function seed() {
  const { db } = await import("./index");
  const { availabilityRules } = await import("./schema");

  console.log("→ Insertion des disponibilités par défaut…");

  await db.delete(availabilityRules);

  const weekdays = [1, 2, 3, 4, 5];
  for (const weekday of weekdays) {
    await db.insert(availabilityRules).values([
      { weekday, startTime: "09:00:00", endTime: "12:00:00", slotDuration: 30 },
      { weekday, startTime: "14:00:00", endTime: "18:00:00", slotDuration: 30 },
    ]);
  }

  await db.insert(availabilityRules).values({
    weekday: 6,
    startTime: "10:00:00",
    endTime: "12:00:00",
    slotDuration: 30,
  });

  console.log("✓ Seed terminé : 5 jours x 2 plages + samedi matin");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
