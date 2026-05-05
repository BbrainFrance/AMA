import { setRequestLocale } from "next-intl/server";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="container max-w-3xl py-32 prose prose-invert prose-headings:font-display">
      <h1>Mentions légales</h1>
      <h2>Éditeur du site</h2>
      <p>
        Auto Move Azur — 06130 Grasse, France.<br />
        Email : automoveazur@gmail.com<br />
        Téléphone : 04 88 91 94 00
      </p>
      <h2>Hébergement</h2>
      <p>Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble du contenu présent sur ce site est protégé par le droit d'auteur.</p>
    </article>
  );
}
