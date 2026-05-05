/**
 * Configuration partagée côté client (uniquement variables NEXT_PUBLIC_*).
 */
export const siteConfig = {
  name: "Auto Move Azur",
  shortName: "AMA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://automoveazur.fr",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "automoveazur@gmail.com",
  phoneFixed: process.env.NEXT_PUBLIC_PHONE_FIXED ?? "+33488919400",
  phoneWhatsapp: process.env.NEXT_PUBLIC_PHONE_WHATSAPP ?? "+33614760151",
  address: "06130 Grasse, France",
  social: {
    instagram: "https://www.instagram.com/automoveazur/",
    google: "https://g.co/kgs/automoveazur",
  },
} as const;

/** Convertit +33xxxxxxxx en xxxxxxxx pour wa.me */
export function whatsappUrl(message?: string) {
  const phone = siteConfig.phoneWhatsapp.replace(/\D/g, "");
  const params = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${params}`;
}

export function telUrl(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
