import "dotenv/config";
import { db } from "./index";
import { availabilityRules } from "./schema";

async function seed() {
  console.log("→ Insertion des disponibilités par défaut…");

  await db.delete(availabilityRules);

  // Lundi à vendredi 9h-12h et 14h-18h, créneaux de 30 min
  const weekdays = [1, 2, 3, 4, 5];
  for (const weekday of weekdays) {
    await db.insert(availabilityRules).values([
      { weekday, startTime: "09:00:00", endTime: "12:00:00", slotDuration: 30 },
      { weekday, startTime: "14:00:00", endTime: "18:00:00", slotDuration: 30 },
    ]);
  }

  // Samedi matin uniquement
  await db.insert(availabilityRules).values({
    weekday: 6,
    startTime: "10:00:00",
    endTime: "12:00:00",
    slotDuration: 30,
  });

  console.log("✓ Seed terminé.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
