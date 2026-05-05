import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { bookings, blockedDates } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Phone, Mail, LogOut, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const upcomingBookings = await db
    .select()
    .from(bookings)
    .where(gte(bookings.startsAt, new Date()))
    .orderBy(bookings.startsAt)
    .limit(50);

  const blocked = await db
    .select()
    .from(blockedDates)
    .where(gte(blockedDates.date, format(new Date(), "yyyy-MM-dd")))
    .orderBy(blockedDates.date);

  const recentPast = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(10);

  return (
    <div className="min-h-screen bg-carbon-900">
      <header className="border-b border-white/10 bg-carbon-800">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-racing flex items-center justify-center font-mono text-[10px] font-bold text-racing">
              AMA
            </div>
            <h1 className="font-display font-bold">Admin Dashboard</h1>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" /> Déconnexion
            </Button>
          </form>
        </div>
      </header>

      <main className="container py-8 space-y-12">
        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
            <Calendar className="size-3" /> RDV à venir ({upcomingBookings.length})
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-muted-foreground">Aucun rendez-vous à venir.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingBookings.map((b) => (
                <article
                  key={b.id}
                  className="border border-white/10 bg-carbon-800 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold">{b.customerName}</p>
                      <p className="text-xs font-mono text-muted-foreground capitalize">
                        {format(new Date(b.startsAt), "EEE d MMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 ${
                        b.status === "confirmed"
                          ? "bg-racing/10 text-racing"
                          : b.status === "cancelled"
                          ? "bg-white/5 text-muted-foreground line-through"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <a href={`tel:${b.customerPhone}`} className="flex items-center gap-2 hover:text-racing">
                      <Phone className="size-3 shrink-0" /> {b.customerPhone}
                    </a>
                    <a href={`mailto:${b.customerEmail}`} className="flex items-center gap-2 hover:text-racing">
                      <Mail className="size-3 shrink-0" /> {b.customerEmail}
                    </a>
                    {b.vehicleInfo && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="size-3 shrink-0" /> {b.vehicleInfo}
                      </p>
                    )}
                    {(b.pickupAddress || b.dropoffAddress) && (
                      <p className="text-muted-foreground text-xs">
                        {b.pickupAddress ?? "?"} → {b.dropoffAddress ?? "?"}
                      </p>
                    )}
                    {b.notes && (
                      <p className="text-xs text-muted-foreground italic mt-2 pt-2 border-t border-white/5">
                        “{b.notes}”
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-racing mb-4">
            <Clock className="size-3" /> Dates bloquées
          </div>
          {blocked.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune date bloquée.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {blocked.map((d) => (
                <span
                  key={d.id}
                  className="px-3 py-1.5 border border-white/10 bg-carbon-800 text-sm font-mono"
                >
                  {format(new Date(d.date), "d MMM yyyy", { locale: fr })}
                  {d.reason && <span className="text-muted-foreground ml-2">— {d.reason}</span>}
                </span>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            (Gestion des dates bloquées via Drizzle Studio : <code className="text-racing">npm run db:studio</code>)
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Historique récent
          </div>
          <div className="border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-carbon-800 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Créé</th>
                  <th className="text-left p-3">Date RDV</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPast.map((b) => (
                  <tr key={b.id} className="border-t border-white/5">
                    <td className="p-3 text-muted-foreground text-xs">
                      {format(new Date(b.createdAt), "d/MM HH:mm", { locale: fr })}
                    </td>
                    <td className="p-3 text-xs">
                      {format(new Date(b.startsAt), "d MMM HH:mm", { locale: fr })}
                    </td>
                    <td className="p-3">{b.customerName}</td>
                    <td className="p-3 text-xs font-mono uppercase">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
