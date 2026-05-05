"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "fr", label: "Français", flag: "FR" },
  { code: "en", label: "English", flag: "EN" },
  { code: "it", label: "Italiano", flag: "IT" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  const switchTo = (code: string) => {
    router.replace(pathname, { locale: code as "fr" | "en" | "it" });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Language"
      >
        <Globe className="size-4" />
        <span>{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 border border-white/10 bg-carbon-800/95 backdrop-blur-xl shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchTo(lang.code)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors",
                lang.code === locale ? "text-racing" : "text-foreground",
              )}
            >
              <span>
                <span className="mr-3 text-muted-foreground">{lang.flag}</span>
                {lang.label}
              </span>
              {lang.code === locale && <Check className="size-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
