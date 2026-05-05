# Auto Move Azur — Site V2

Refonte commerciale du site `automoveazur.fr`.
Stack : **Next.js 15 (App Router) · Tailwind v3 · Neon Postgres · Drizzle ORM · Auth.js · next-intl · Resend**.

## Fonctionnalités

- Design **Dynamic Performance** (carbone + rouge racing F1 `#E10600`)
- **Multilingue** FR / EN / IT (next-intl)
- **Feed Instagram** synchronisé automatiquement (Vercel Cron, toutes les 30 min)
- **Highlights stories** verticales 9:16 (style Reels)
- **Système de RDV maison** (calendrier + créneaux + emails de confirmation + .ics)
- **Bouton WhatsApp flottant** (chat OU appel mobile)
- **Dashboard admin** protégé (Auth.js)
- Optimisé pour Vercel + Neon

---

## 1. Prérequis

- Node.js ≥ 20
- Compte **Vercel** (gratuit)
- Compte **Neon** (gratuit) — https://neon.tech
- Compte **Resend** (gratuit jusqu'à 3000 emails/mois) — https://resend.com
- Compte Instagram **Business** lié à une **Page Facebook**

---

## 2. Installation locale

```powershell
# Depuis C:\Users\Max\Desktop\A.M.A
npm install
```

Copier le fichier d'environnement :

```powershell
Copy-Item .env.example .env.local
```

Puis ouvrir `.env.local` et remplir les variables (voir section 4).

---

## 3. Base de données (Neon)

### Créer la base

1. Aller sur https://console.neon.tech → **New Project**
2. Récupérer la chaîne **Pooled connection** et la coller dans `DATABASE_URL`

### Pousser le schéma

```powershell
npm run db:push
```

### Seeder les disponibilités par défaut (lundi-vendredi 9h-12h / 14h-18h, samedi 10h-12h)

```powershell
npm run db:seed
```

### Visualiser la base (interface graphique)

```powershell
npm run db:studio
```

---

## 4. Variables d'environnement

Toutes les variables sont documentées dans `.env.example`. Ouvrir le fichier :

```powershell
notepad .env.local
```

### Générer un secret Auth.js

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Générer le hash bcrypt du mot de passe admin

```powershell
node -e "console.log(require('bcryptjs').hashSync('VotreMotDePasseIci', 10))"
```

Coller le résultat dans `ADMIN_PASSWORD_HASH`.

### Récupérer les tokens Instagram

1. Créer une app sur https://developers.facebook.com/apps/ (type "Business")
2. Ajouter le produit **Instagram Graph API**
3. Lier la page Facebook + le compte IG Business
4. Générer un **token longue durée** (60 jours) via l'**Access Token Tool**
5. Récupérer l'**Instagram User ID** via `https://graph.facebook.com/v21.0/me/accounts?access_token=...`

⚠️ Le token expire tous les 60 jours. Vous pouvez l'automatiser via une route `/api/cron/refresh-token`.

---

## 5. Lancer en dev

```powershell
npm run dev
```

Ouvrir http://localhost:3000

- Site public : `http://localhost:3000/fr` (ou `/en`, `/it`)
- Admin : `http://localhost:3000/admin/login`

---

## 6. Déploiement Vercel

### Première fois

```powershell
npm i -g vercel
vercel login
vercel
```

### Configurer les variables d'environnement

Soit via le dashboard Vercel (Settings → Environment Variables), soit en ligne de commande :

```powershell
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD_HASH
vercel env add IG_USER_ID
vercel env add IG_ACCESS_TOKEN
vercel env add CRON_SECRET
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM
vercel env add ADMIN_NOTIFICATION_EMAIL
vercel env add NEXT_PUBLIC_PHONE_FIXED
vercel env add NEXT_PUBLIC_PHONE_WHATSAPP
vercel env add NEXT_PUBLIC_EMAIL
vercel env add NEXT_PUBLIC_SITE_URL
```

### Déployer en production

```powershell
vercel --prod
```

Le cron Instagram (`vercel.json`) tournera automatiquement toutes les 30 min.

---

## 7. Structure du projet

```
A.M.A/
├── messages/                  # Traductions FR / EN / IT
│   ├── fr.json
│   ├── en.json
│   └── it.json
├── src/
│   ├── app/
│   │   ├── [locale]/          # Pages localisées
│   │   │   ├── page.tsx       # Home
│   │   │   ├── booking/
│   │   │   ├── services/
│   │   │   ├── gallery/
│   │   │   ├── contact/
│   │   │   ├── legal/
│   │   │   └── privacy/
│   │   ├── admin/             # Dashboard (hors localisation)
│   │   ├── api/
│   │   │   ├── availability/  # GET ?date= | ?month=
│   │   │   ├── bookings/      # POST
│   │   │   ├── auth/          # NextAuth
│   │   │   └── cron/instagram # Sync IG (Vercel Cron)
│   │   ├── layout.tsx
│   │   └── page.tsx           # Redirige vers /fr
│   ├── components/
│   │   ├── booking/           # Widget de RDV
│   │   ├── layout/            # Header, Footer, WhatsApp FAB
│   │   ├── sections/          # Hero, Services, IG Feed…
│   │   └── ui/                # Boutons, inputs (style shadcn)
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── index.ts           # Client Neon + Drizzle
│   │   └── seed.ts
│   ├── i18n/                  # Routing & request config next-intl
│   ├── lib/
│   │   ├── instagram.ts       # API Graph + DB sync
│   │   ├── availability.ts    # Calcul des créneaux
│   │   ├── email.ts           # Resend + .ics
│   │   ├── config.ts          # Site config
│   │   └── utils.ts
│   ├── auth.ts                # NextAuth config
│   └── middleware.ts          # Routing i18n
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── vercel.json                # Cron jobs
└── package.json
```

---

## 8. Workflow habituel

### Modifier les disponibilités

Via Drizzle Studio :

```powershell
npm run db:studio
```

Puis éditer la table `availability_rules` (weekday : 0=dimanche … 6=samedi).

### Bloquer une date (vacances)

Insérer une ligne dans `blocked_dates` (table accessible via Drizzle Studio).

### Voir les nouveaux RDV

Connectez-vous sur `/admin` (https://votre-site.fr/admin/login).

### Forcer une sync Instagram manuellement

```powershell
curl http://localhost:3000/api/cron/instagram -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

---

## 9. Commandes utiles

```powershell
# Dev
npm run dev

# Build prod (test local)
npm run build
npm run start

# Lint
npm run lint

# DB
npm run db:generate    # Génère une migration
npm run db:push        # Applique le schéma directement (dev)
npm run db:studio      # GUI sur localhost:4983
npm run db:seed        # Réinitialise les disponibilités

# Vercel
vercel               # Deploy preview
vercel --prod        # Deploy production
vercel logs          # Voir les logs
```

---

## 10. À personnaliser plus tard

- [ ] Logo SVG (placeholder actuel : carré rouge "AMA")
- [ ] Photos hero (actuellement : illustration SVG stylisée)
- [ ] Texte "About" / portrait du gérant
- [ ] Renouvellement automatique du token IG (cron mensuel)
- [ ] Ajout d'un blog (articles convoyages) → table `posts`
- [ ] Avis Google embarqués (Place API)

---

## Support

- Téléphone fixe : 04 88 91 94 00
- WhatsApp : 06 14 76 01 51
- Email : automoveazur@gmail.com
