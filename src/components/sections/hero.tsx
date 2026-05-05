"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-20">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Lignes coordonnées style HUD */}
      <div className="absolute top-24 left-6 hidden md:block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div>43.6584° N</div>
        <div>6.9226° E</div>
        <div className="mt-2 text-racing">// GRASSE_06</div>
      </div>

      <div className="absolute top-24 right-6 hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-racing">
        <span className="live-dot" />
        {t("live")}
      </div>

      <div className="container relative flex-1 grid lg:grid-cols-12 gap-8 items-center py-12">
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest"
          >
            <span className="h-1 w-1 bg-racing" />
            {t("badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-tight"
          >
            {t("title").split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-stroke">
              {t("title").split(" ").slice(-2).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="/booking">
                {t("ctaPrimary")} <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10 scanlines">
            {/* Visuel placeholder en attendant images réelles : dégradé + SVG voiture stylisée */}
            <div className="absolute inset-0 bg-gradient-to-br from-carbon-700 via-carbon-800 to-carbon-900" />
            <svg
              viewBox="0 0 400 500"
              className="absolute inset-0 w-full h-full opacity-90"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E10600" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#E10600" stopOpacity="0" />
                </linearGradient>
                <pattern id="dotsHero" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.5" fill="rgba(255,255,255,0.15)" />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#dotsHero)" />
              <g transform="translate(50,200)">
                <path
                  d="M20 80 Q40 20 130 10 Q220 0 260 30 Q290 50 295 80 L290 110 L20 110 Z"
                  fill="rgba(225,6,0,0.15)"
                  stroke="#E10600"
                  strokeWidth="1.5"
                />
                <circle cx="80" cy="110" r="22" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle cx="240" cy="110" r="22" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle cx="80" cy="110" r="8" fill="#E10600" />
                <circle cx="240" cy="110" r="8" fill="#E10600" />
              </g>
              <rect x="0" y="0" width="400" height="500" fill="url(#carGrad)" />
            </svg>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[10px] uppercase tracking-widest">
              <div className="space-y-1">
                <div className="text-muted-foreground">// CARGO</div>
                <div className="text-foreground">McLaren Senna</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">ETA</div>
                <div className="text-racing">04:32:18</div>
              </div>
            </div>

            <div className="absolute top-4 left-4 px-2 py-1 bg-racing text-white text-[10px] font-mono uppercase tracking-widest">
              ● Live
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="border-t border-white/5"
      >
        <div className="container grid grid-cols-3">
          {[
            { v: t("stat1Value"), l: t("stat1Label") },
            { v: t("stat2Value"), l: t("stat2Label") },
            { v: t("stat3Value"), l: t("stat3Label") },
          ].map((s, i) => (
            <div
              key={i}
              className={`py-6 md:py-8 ${i > 0 ? "border-l border-white/5 pl-4 md:pl-8" : ""}`}
            >
              <div className="font-display text-2xl md:text-4xl font-bold">{s.v}</div>
              <div className="mt-1 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <ArrowDown className="size-4 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
