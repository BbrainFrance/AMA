import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { siteConfig, telUrl, whatsappUrl } from "@/lib/config";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const tFooter = await getTranslations("Footer");

  return (
    <section className="py-32">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
          <span className="h-1 w-1 bg-racing" />
          Contact
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05]">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-12 grid sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <a
            href={telUrl(siteConfig.phoneFixed)}
            className="card-racing p-8 group"
          >
            <Phone className="size-8 text-racing mb-6 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Téléphone fixe
            </p>
            <p className="font-display text-2xl font-bold">{tFooter("phone")}</p>
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="card-racing p-8 group"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-[#25D366] mb-6 group-hover:scale-110 transition-transform">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              WhatsApp
            </p>
            <p className="font-display text-2xl font-bold">06 14 76 01 51</p>
          </a>
          <a href={`mailto:${siteConfig.email}`} className="card-racing p-8 group">
            <Mail className="size-8 text-racing mb-6 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Email
            </p>
            <p className="font-display text-xl font-bold break-all">{siteConfig.email}</p>
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="card-racing p-8 group"
          >
            <Instagram className="size-8 text-racing mb-6 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Instagram
            </p>
            <p className="font-display text-2xl font-bold">@automoveazur</p>
          </a>
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="size-4 text-racing" />
          {tFooter("address")}
        </div>
      </div>
    </section>
  );
}
