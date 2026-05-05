"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { IgHighlight } from "@/db/schema";

export function HighlightsCarousel({ highlights }: { highlights: IgHighlight[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (highlights.length === 0) return null;

  const active = activeIdx !== null ? highlights[activeIdx] : null;

  const next = () =>
    setActiveIdx((i) => (i === null ? null : (i + 1) % highlights.length));
  const prev = () =>
    setActiveIdx((i) =>
      i === null ? null : (i - 1 + highlights.length) % highlights.length,
    );

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x">
        {highlights.map((h, idx) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="group shrink-0 snap-start flex flex-col items-center gap-2"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-br from-racing via-racing-700 to-racing/30 transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-carbon-900 border-2 border-carbon-900">
                {h.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.coverUrl}
                    alt={h.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground max-w-[80px] truncate">
              {h.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveIdx(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(null);
              }}
            >
              <X className="size-6" />
            </button>

            {highlights.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-racing"
                >
                  <ChevronLeft className="size-8" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-racing"
                >
                  <ChevronRight className="size-8" />
                </button>
              </>
            )}

            <motion.div
              key={active.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[400px] aspect-[9/16] bg-carbon-900 overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {active.items.map((item, i) => (
                <div key={i} className="absolute inset-0">
                  {item.media_type === "VIDEO" ? (
                    <video
                      src={item.media_url}
                      poster={item.thumbnail_url}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.media_url}
                      alt={active.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}

              <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
                <div className="h-0.5 flex-1 bg-white/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    onAnimationComplete={() => next()}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="absolute top-8 left-4 text-xs font-mono uppercase tracking-widest text-white">
                {active.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
