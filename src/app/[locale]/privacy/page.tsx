import { setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="container max-w-3xl py-32 prose prose-invert prose-headings:font-display">
      <h1>Politique de confidentialité</h1>
      <p>
        Auto Move Azur respecte votre vie privée. Les données collectées via le
        formulaire de prise de rendez-vous sont utilisées uniquement pour traiter
        votre demande et ne sont jamais transmises à des tiers.
      </p>
      <h2>Données collectées</h2>
      <ul>
        <li>Nom, email, téléphone</li>
        <li>Informations sur le véhicule à transporter</li>
        <li>Adresses de prise en charge et de livraison</li>
      </ul>
      <h2>Conservation</h2>
      <p>Les données sont conservées 3 ans à compter de votre dernier contact.</p>
      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification
        et de suppression de vos données. Pour l'exercer, contactez-nous à
        automoveazur@gmail.com.
      </p>
    </article>
  );
}
