"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Truck, Globe2, Crown, Mountain } from "lucide-react";

const items = [
  { key: "france", Icon: Truck, num: "01" },
  { key: "europe", Icon: Globe2, num: "02" },
  { key: "uk", Icon: Crown, num: "03" },
  { key: "swiss", Icon: Mountain, num: "04" },
] as const;

export function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
              <span className="h-1 w-1 bg-racing" />
              {t("eyebrow")}
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {t("title")}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {items.map(({ key, Icon, num }, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group card-racing p-6 md:p-8 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-12">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {num}
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-racing group-hover:rotate-12 transition-all" />
              </div>

              <Icon className="size-10 text-racing mb-6 transition-transform group-hover:scale-110" />

              <h3 className="font-display text-2xl font-bold mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[60px]">
                {t(`${key}.desc`)}
              </p>

              <div className="pt-4 border-t border-white/5">
                <span className="inline-block px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-racing/10 text-racing">
                  {t(`${key}.tag`)}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
