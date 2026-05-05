import { NextRequest, NextResponse } from "next/server";
import { syncInstagramPosts, syncInstagramHighlights } from "@/lib/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Endpoint déclenché par Vercel Cron toutes les 30 minutes.
 * Configuration : voir vercel.json
 *
 * Sécurité : header `Authorization: Bearer <CRON_SECRET>` requis.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron envoie automatiquement Authorization: Bearer <CRON_SECRET>
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [posts, highlights] = await Promise.all([
      syncInstagramPosts(),
      syncInstagramHighlights().catch((e) => ({ error: String(e), synced: 0 })),
    ]);

    return NextResponse.json({
      ok: true,
      posts,
      highlights,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Cron Instagram failed:", e);
    return NextResponse.json(
      { error: "Sync failed", details: String(e) },
      { status: 500 },
    );
  }
}
