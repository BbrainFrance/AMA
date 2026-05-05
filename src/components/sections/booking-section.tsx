import { getTranslations } from "next-intl/server";
import { BookingWidget } from "@/components/booking/booking-widget";

export async function BookingSection() {
  const t = await getTranslations("Booking");

  return (
    <section id="booking" className="py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
              <span className="h-1 w-1 bg-racing" />
              {t("eyebrow")}
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {t("title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-md">
              {t("subtitle")}
            </p>
          </div>
          <div className="lg:col-span-7">
            <BookingWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
