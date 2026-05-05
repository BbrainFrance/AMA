import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getAvailableSlots } from "@/lib/availability";
import { sendBookingConfirmation } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BookingInput = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6).max(30),
  vehicleInfo: z.string().max(300).optional(),
  pickupAddress: z.string().max(300).optional(),
  dropoffAddress: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
  locale: z.enum(["fr", "en", "it"]).default("fr"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BookingInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const start = new Date(data.startsAt);
    const dateStr = start.toISOString().slice(0, 10);

    // Re-vérification du créneau côté serveur (anti race condition)
    const slots = await getAvailableSlots(dateStr);
    const slotStillFree = slots.some((s) => s.start === data.startsAt);
    if (!slotStillFree) {
      return NextResponse.json(
        { error: "Slot no longer available" },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(bookings)
      .values({
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        vehicleInfo: data.vehicleInfo,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        notes: data.notes,
        locale: data.locale,
        status: "confirmed",
      })
      .returning();

    // Envoi des emails (non bloquant pour la réponse)
    sendBookingConfirmation(created).catch((e) =>
      console.error("Email send failed:", e),
    );

    return NextResponse.json({ booking: { id: created.id, status: created.status } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
