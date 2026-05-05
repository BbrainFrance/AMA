import { db } from "@/db";
import { igPosts, igHighlights } from "@/db/schema";
import { desc } from "drizzle-orm";

const IG_API = "https://graph.instagram.com";

export type IgMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface IgApiMedia {
  id: string;
  media_type: IgMediaType;
  media_url: string;
  permalink: string;
  caption?: string;
  thumbnail_url?: string;
  timestamp: string;
}

/**
 * Récupère les derniers posts publiés sur le compte Instagram Business.
 * Doc : https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
 */
export async function fetchInstagramMedia(limit = 20): Promise<IgApiMedia[]> {
  const userId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;

  if (!userId || !token) {
    return [];
  }

  const fields = [
    "id",
    "media_type",
    "media_url",
    "permalink",
    "caption",
    "thumbnail_url",
    "timestamp",
  ].join(",");

  const url = `${IG_API}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Instagram API: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as { data: IgApiMedia[] };
  return json.data ?? [];
}

/**
 * Synchronise les posts en base. Idempotent (upsert sur l'ID).
 */
export async function syncInstagramPosts() {
  const media = await fetchInstagramMedia(30);

  if (media.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  let inserted = 0;
  for (const m of media) {
    await db
      .insert(igPosts)
      .values({
        id: m.id,
        mediaType: m.media_type,
        mediaUrl: m.media_url,
        permalink: m.permalink,
        caption: m.caption ?? null,
        thumbnailUrl: m.thumbnail_url ?? null,
        timestamp: new Date(m.timestamp),
      })
      .onConflictDoUpdate({
        target: igPosts.id,
        set: {
          mediaUrl: m.media_url,
          caption: m.caption ?? null,
          thumbnailUrl: m.thumbnail_url ?? null,
        },
      });
    inserted++;
  }

  return { inserted, updated: 0 };
}

/**
 * Récupère les Story Highlights et leurs items.
 * Endpoint: /{ig-user-id}?fields=stories ne fonctionne pas pour les highlights publics ;
 * on utilise /{ig-user-id}/highlights puis /{highlight-id}?fields=cover_media,...
 */
export async function syncInstagramHighlights() {
  const userId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;

  if (!userId || !token) {
    return { synced: 0 };
  }

  const url = `${IG_API}/${userId}?fields=stories&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { synced: 0, error: await res.text() };
  }

  const json = (await res.json()) as {
    stories?: { data: Array<{ id: string }> };
  };

  if (!json.stories?.data) return { synced: 0 };

  let count = 0;
  for (const story of json.stories.data) {
    const detailUrl = `${IG_API}/${story.id}?fields=id,media_type,media_url,thumbnail_url,timestamp&access_token=${token}`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) continue;
    const detail = await detailRes.json();

    await db
      .insert(igHighlights)
      .values({
        id: story.id,
        title: "Stories",
        coverUrl: detail.thumbnail_url ?? detail.media_url,
        items: [detail],
      })
      .onConflictDoUpdate({
        target: igHighlights.id,
        set: {
          coverUrl: detail.thumbnail_url ?? detail.media_url,
          items: [detail],
          updatedAt: new Date(),
        },
      });
    count++;
  }

  return { synced: count };
}

/**
 * Récupère les posts depuis la base (cache).
 */
export async function getRecentPosts(limit = 9) {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(igPosts)
      .orderBy(desc(igPosts.timestamp))
      .limit(limit);
  } catch (e) {
    console.error("Failed to read igPosts:", e);
    return [];
  }
}

export async function getHighlights(limit = 12) {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db
      .select()
      .from(igHighlights)
      .orderBy(desc(igHighlights.updatedAt))
      .limit(limit);
  } catch (e) {
    console.error("Failed to read igHighlights:", e);
    return [];
  }
}
