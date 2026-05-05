import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, getMonthAvailability } from "@/lib/availability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const date = params.get("date"); // YYYY-MM-DD
  const month = params.get("month"); // YYYY-MM

  try {
    if (date) {
      const slots = await getAvailableSlots(date);
      return NextResponse.json({ slots });
    }

    if (month) {
      const [y, m] = month.split("-").map(Number);
      if (!y || !m) {
        return NextResponse.json({ error: "Invalid month" }, { status: 400 });
      }
      const days = await getMonthAvailability(y, m);
      return NextResponse.json({ days });
    }

    return NextResponse.json(
      { error: "Provide 'date' (YYYY-MM-DD) or 'month' (YYYY-MM)" },
      { status: 400 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
