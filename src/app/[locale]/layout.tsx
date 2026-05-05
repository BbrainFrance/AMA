import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { Toaster } from "sonner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brand" });
  const tHero = await getTranslations({ locale, namespace: "Hero" });

  return {
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s — ${t("name")}`,
    },
    description: tHero("subtitle"),
    keywords: [
      "transport véhicule",
      "convoyage voiture",
      "transport voiture luxe",
      "Côte d'Azur",
      "Grasse",
      "Cannes",
      "Monaco",
      "supercar transport",
    ],
    openGraph: {
      title: `${t("name")} — ${t("tagline")}`,
      description: tHero("subtitle"),
      type: "website",
      locale,
    },
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
        it: "/it",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsappFab />
      </div>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F1EA",
          },
        }}
      />
    </NextIntlClientProvider>
  );
}
