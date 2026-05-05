"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/gallery", key: "gallery" },
  { href: "/booking", key: "booking" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const tBrand = useTranslations("Brand");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-carbon-900/85 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative">
            <div className="h-8 w-8 border border-racing flex items-center justify-center font-mono text-[10px] font-bold tracking-tighter text-racing group-hover:bg-racing group-hover:text-white transition-colors">
              AMA
            </div>
            <span className="absolute -top-1 -right-1 live-dot" />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-display font-bold tracking-wider">
              {tBrand("name").toUpperCase()}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {tBrand("tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors",
                  isActive
                    ? "text-racing"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(link.key)}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-1/2 h-px w-6 -translate-x-1/2 bg-racing"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/booking">
              {t("cta")} <ChevronRight className="size-3" />
            </Link>
          </Button>
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-white/5 bg-carbon-900/95 backdrop-blur-xl"
          >
            <nav className="container flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="flex items-center justify-between border-b border-white/5 py-4 text-sm font-mono uppercase tracking-widest hover:text-racing"
                >
                  {t(link.key)}
                  <ChevronRight className="size-4" />
                </Link>
              ))}
              <Button asChild size="lg" className="mt-4">
                <Link href="/booking">{t("cta")}</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
