import { Resend } from "resend";
import { createEvent } from "ics";
import { format } from "date-fns";
import { fr, enUS, it } from "date-fns/locale";
import type { Booking } from "@/db/schema";
import { siteConfig } from "./config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const localeMap = { fr, en: enUS, it } as const;

function generateIcs(booking: Booking) {
  const start = new Date(booking.startsAt);
  const { error, value } = createEvent({
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
    duration: {
      minutes: Math.round(
        (new Date(booking.endsAt).getTime() - start.getTime()) / 60000,
      ),
    },
    title: `${siteConfig.name} - Rendez-vous`,
    description: `Véhicule : ${booking.vehicleInfo ?? "—"}\n\nNotes : ${booking.notes ?? "—"}`,
    location: `${siteConfig.name}, ${siteConfig.address}`,
    organizer: { name: siteConfig.name, email: siteConfig.email },
  });
  if (error) {
    console.error("ICS generation:", error);
    return null;
  }
  return value;
}

export async function sendBookingConfirmation(booking: Booking) {
  if (!resend) {
    console.warn("RESEND_API_KEY non défini, email non envoyé.");
    return;
  }

  const locale = (booking.locale as keyof typeof localeMap) ?? "fr";
  const dateLocale = localeMap[locale];
  const startDate = new Date(booking.startsAt);
  const dateLabel = format(startDate, "EEEE d MMMM yyyy 'à' HH:mm", {
    locale: dateLocale,
  });

  const greeting = locale === "en" ? "Hello" : locale === "it" ? "Ciao" : "Bonjour";
  const intro =
    locale === "en"
      ? "Your appointment with Auto Move Azur is confirmed."
      : locale === "it"
      ? "Il tuo appuntamento con Auto Move Azur è confermato."
      : "Votre rendez-vous chez Auto Move Azur est confirmé.";

  const ics = generateIcs(booking);

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background:#0A0A0B; color:#F5F1EA; padding:32px;">
      <div style="border-left:3px solid #E10600; padding-left:16px; margin-bottom:32px;">
        <p style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#9A9A9F; margin:0;">Auto Move Azur</p>
        <h1 style="font-size:24px; margin:8px 0 0;">${intro}</h1>
      </div>
      <p>${greeting} ${booking.customerName},</p>
      <table style="width:100%; border-collapse:collapse; margin:24px 0;">
        <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08); color:#9A9A9F; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Date</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">${dateLabel}</td></tr>
        <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08); color:#9A9A9F; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Véhicule</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">${booking.vehicleInfo ?? "—"}</td></tr>
        <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08); color:#9A9A9F; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Trajet</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">${booking.pickupAddress ?? "—"} → ${booking.dropoffAddress ?? "—"}</td></tr>
      </table>
      <p style="color:#9A9A9F; font-size:13px;">Pour toute modification : <a href="tel:${siteConfig.phoneFixed}" style="color:#E10600;">${siteConfig.phoneFixed}</a></p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? `Auto Move Azur <onboarding@resend.dev>`,
    to: booking.customerEmail,
    subject: `${siteConfig.name} — ${dateLabel}`,
    html,
    attachments: ics
      ? [{ filename: "rendez-vous.ics", content: Buffer.from(ics).toString("base64") }]
      : undefined,
  });

  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? `Auto Move Azur <onboarding@resend.dev>`,
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `Nouveau RDV — ${booking.customerName} — ${dateLabel}`,
      html: `
        <h2>Nouveau rendez-vous</h2>
        <p><strong>Client :</strong> ${booking.customerName} (${booking.customerEmail} / ${booking.customerPhone})</p>
        <p><strong>Date :</strong> ${dateLabel}</p>
        <p><strong>Véhicule :</strong> ${booking.vehicleInfo ?? "—"}</p>
        <p><strong>De :</strong> ${booking.pickupAddress ?? "—"}</p>
        <p><strong>À :</strong> ${booking.dropoffAddress ?? "—"}</p>
        <p><strong>Notes :</strong> ${booking.notes ?? "—"}</p>
      `,
    });
  }
}
