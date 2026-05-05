import { setRequestLocale } from "next-intl/server";
import { BookingSection } from "@/components/sections/booking-section";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <BookingSection />
    </div>
  );
}
