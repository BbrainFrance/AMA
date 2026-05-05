import { getTranslations } from "next-intl/server";
import { ExternalLink, Instagram, Play } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getRecentPosts, getHighlights } from "@/lib/instagram";
import { HighlightsCarousel } from "./highlights-carousel";
import type { IgHighlight } from "@/db/schema";

export async function InstagramFeed() {
  const t = await getTranslations("Instagram");

  const [posts, highlights] = await Promise.all([
    getRecentPosts(9),
    getHighlights(12),
  ]);

  return (
    <section id="instagram" className="py-24 md:py-32 bg-carbon-900/50 border-y border-white/5">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
              <span className="live-dot" />
              {t("eyebrow")}
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {t("title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">
              {t("subtitle")}
            </p>
          </div>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-racing hover:bg-racing/5 px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <Instagram className="size-4" />
            {t("follow")}
          </a>
        </div>

        {highlights.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              {t("highlights")}
            </h3>
            <HighlightsCarousel highlights={highlights as IgHighlight[]} />
          </div>
        )}

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 text-center">
            <Instagram className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground max-w-md">{t("empty")}</p>
            <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
              IG_USER_ID + IG_ACCESS_TOKEN requis
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {posts.map((post) => {
              const isVideo = post.mediaType === "VIDEO";
              const src = isVideo
                ? post.thumbnailUrl ?? post.mediaUrl
                : post.mediaUrl;

              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden border border-white/5 bg-carbon-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={post.caption?.slice(0, 80) ?? "Instagram post"}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-50"
                    loading="lazy"
                  />
                  {isVideo && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm p-1.5">
                      <Play className="size-3 text-white fill-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white line-clamp-3 mb-2">
                      {post.caption?.slice(0, 120)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-racing">
                      {t("viewOnInstagram")} <ExternalLink className="size-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
