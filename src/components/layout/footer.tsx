import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { siteConfig, telUrl } from "@/lib/config";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tBrand = useTranslations("Brand");

  return (
    <footer className="relative border-t border-white/5 bg-carbon-900 mt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing to-transparent" />

      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 border border-racing flex items-center justify-center font-mono text-[10px] font-bold tracking-tighter text-racing">
                AMA
              </div>
              <span className="font-display font-bold tracking-wider">
                {tBrand("name").toUpperCase()}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-racing mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-racing">{tNav("services")}</Link></li>
              <li><Link href="/gallery" className="hover:text-racing">{tNav("gallery")}</Link></li>
              <li><Link href="/booking" className="hover:text-racing">{tNav("booking")}</Link></li>
              <li><Link href="/contact" className="hover:text-racing">{tNav("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-racing mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={telUrl(siteConfig.phoneFixed)} className="flex items-center gap-3 hover:text-racing">
                  <Phone className="size-4" /> {t("phone")}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 hover:text-racing break-all">
                  <Mail className="size-4 shrink-0" /> {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4" /> {t("address")}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-racing mb-4">
              Social
            </h3>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm hover:text-racing"
            >
              <Instagram className="size-4" /> @automoveazur
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {tBrand("name")}. {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-foreground">{t("legal")}</Link>
            <Link href="/privacy" className="hover:text-foreground">{t("privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
