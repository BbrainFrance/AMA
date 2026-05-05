import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Services } from "@/components/sections/services";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { BookingSection } from "@/components/sections/booking-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <InstagramFeed />
      <BookingSection />
    </>
  );
}
