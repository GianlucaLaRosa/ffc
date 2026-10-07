# FFC Ricerca — piattaforma conferenze

Sito pubblico e CMS per le edizioni della conferenza FFC Ricerca: programma, abstract, sede, archivio e avvisi. Stack: **Next.js 16**, **Payload CMS 3**, **PostgreSQL**, **pnpm**.

## Superfici

| URL | Ruolo |
| --- | --- |
| `/` | Edizione attiva (`Globals` → **Active conference**) |
| `/archive/{slug}` | Edizioni passate con **Public archive** |
| `/admin` | Pannello Payload (marchio FFC Ricerca; chrome in italiano) |
| `/docs` | Guida editor in italiano (stesso login di `/admin`) |

Le voci di programma, abstract e appendice si editano **dall’edizione**, non come voci di menu separate. Il piè di pagina pubblico (`Footer`) ha solo i link **Structure** e **Delegation**; Cookie Policy e Privacy Policy sono fisse.

## Avvio locale

Serve Node 20+ (o 18.20.2+) e pnpm. Postgres in Docker:

```bash
docker compose up -d db
cp .env.example .env
pnpm install
pnpm payload migrate
pnpm dev
```

Apri `http://localhost:3101`. Al primo accesso a `/admin` Payload chiede di creare l’utente amministratore.

In `.env`, `NEXT_PUBLIC_SERVER_URL` deve coincidere con l’URL del dev server (`http://localhost:3101`). `DATABASE_URI` di default punta a Postgres su `localhost:5432` (utente/password/db: `postgres` / `postgres` / `fcc_conference`).

`pnpm seed` è disabilitato: non è più compatibile con lo schema FCR. Paesi, regioni italiane e stati abstract si popolano al boot (`onInit`). Edizioni e contenuti si creano da `/admin`.

### Script

| Comando | Uso |
| --- | --- |
| `pnpm dev` | Dev su porta **3101** |
| `pnpm devsafe` | Come `dev`, dopo aver cancellato `.next` |
| `pnpm build` / `pnpm start` | Build e avvio produzione (stessa porta) |
| `pnpm payload migrate` | Applica le migration Postgres (`push: false`) |
| `pnpm payload generate:types` | Rigenera `src/payload-types.ts` dopo cambi di schema |
| `pnpm payload generate:importmap` | Rigenera l’import map admin |
| `pnpm ci` | `migrate` + `build` |
| `pnpm seed` | Edizione 2025 da brochure, con foto abstract. Se l’edizione c’è già, aggiunge solo le foto mancanti; non imposta **Active conference** |

### Docker (app intera)

`docker compose up` avvia anche l’app sul **3000**, con Postgres interno. In quel caso `NEXT_PUBLIC_SERVER_URL` è `http://localhost:3000`. Per il lavoro quotidiano basta il servizio `db` + `pnpm dev`.

## Ambiente

Vedi `.env.example`. Oltre a database, secret Payload e URL pubblico:

- **`PREVIEW_SECRET`** — anteprima intro da admin (iframe / draft)
- **`BLOB_READ_WRITE_TOKEN`** — media su Vercel Blob in produzione; in locale gli upload restano su disco
- **`NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`** — push lock-screen (reminder di sessione e avvisi **Notices**). Email di contatto: `Globals` → **Programme alerts**
- **`CRON_SECRET`** — solo se uno scheduler esterno chiama `GET /api/programme-alerts` (reminder automatici; gli avvisi **Notices** partono al click su **Send push**)

Non committare `.env`. In produzione usa un `PAYLOAD_SECRET` casuale e una connection string Neon (o equivalente), non quella Docker.

## Produzione

Deploy tipico: **Vercel** + **Neon** + Blob per i media. `vercel.json` imposta `pnpm ci` (migration + build). Schema Postgres solo via migration Payload, non via `db.push`.

### Vercel + GitHub

1. Importa il repo su [vercel.com](https://vercel.com) (GitHub collegato).
2. Variabili: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`; opzionali Blob e VAPID (vedi sopra).
3. Ogni push sul branch di produzione ridistribuisce automaticamente.

### Promemoria push (cron-job.org)

I promemoria “My programme” richiedono un job esterno che chiami `GET /api/programme-alerts` all’intervallo scelto in **Globals → Programme alerts → Check interval** (default ogni **5 minuti**), con header `Authorization: Bearer <CRON_SECRET>`.

Guida passo-passo: [`scripts/cron-job.org.md`](scripts/cron-job.org.md). Test locale o produzione: `pnpm cron:test`.
