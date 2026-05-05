import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-racing mb-4">
        Error 404
      </p>
      <h1 className="font-display text-6xl md:text-8xl font-bold mb-6">
        Off Road
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/fr"
        className="inline-flex items-center gap-2 border border-racing bg-racing text-white px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-racing-600 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
