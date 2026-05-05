import { setRequestLocale } from "next-intl/server";
import { InstagramFeed } from "@/components/sections/instagram-feed";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <InstagramFeed />
    </div>
  );
}
