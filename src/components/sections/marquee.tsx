"use client";

import { useTranslations } from "next-intl";

const brands = [
  "Ferrari", "Lamborghini", "Porsche", "McLaren", "Pagani",
  "Aston Martin", "Bentley", "Rolls-Royce", "Bugatti", "Koenigsegg",
  "Maserati", "Mercedes-AMG", "BMW M", "Audi RS", "Alpine",
];

export function Marquee() {
  const t = useTranslations("Marquee");

  return (
    <section className="relative py-10 border-y border-white/5 bg-carbon-800/40 overflow-hidden">
      <div className="container mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span className="h-1 w-1 bg-racing" />
        {t("label")}
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee gap-12 pr-12">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="font-display text-3xl md:text-5xl font-bold whitespace-nowrap text-foreground/40 hover:text-racing transition-colors"
            >
              {brand}
              <span className="text-racing"> ●</span>
            </div>
          ))}
        </div>
      </div>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </section>
  );
}
