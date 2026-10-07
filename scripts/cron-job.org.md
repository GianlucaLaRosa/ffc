# cron-job.org — promemoria “My programme”

Il sito invia i promemoria push delle sessioni salvate quando un job esterno chiama `GET /api/programme-alerts` a intervalli regolari. L’intervallo lo imposti in admin (**Globals → Programme alerts → Check interval**, step da 5 minuti). Vercel Cron non è usato: configura [cron-job.org](https://cron-job.org) con **lo stesso intervallo**.

## Prerequisiti (Vercel)

Imposta in **Project → Settings → Environment Variables** (Production):

| Variabile | Note |
| --- | --- |
| `CRON_SECRET` | Stringa casuale lunga; la stessa userai su cron-job.org |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Chiavi Web Push |
| `NEXT_PUBLIC_SERVER_URL` | URL pubblico del sito (es. `https://tuo-dominio.vercel.app`) |

In admin: **Globals → Programme alerts** — **Enable session alerts** acceso, **Push contact email** compilata, **Check interval** impostato (default **5 minutes**).

## Job su cron-job.org

1. Crea account e **Create cronjob**.
2. **Title**: `FFC programme alerts` (o simile).
3. **URL**: `https://TUO-DOMINIO/api/programme-alerts`  
   Sostituisci con l’URL di produzione (`NEXT_PUBLIC_SERVER_URL` senza slash finale).
4. **Schedule**: uguale a **Check interval** in admin. Esempi:

   | Check interval | Espressione cron |
   | --- | --- |
   | 5 minutes | `*/5 * * * *` |
   | 10 minutes | `*/10 * * * *` |
   | 15 minutes | `*/15 * * * *` |
   | 20 minutes | `*/20 * * * *` |
   | 25 minutes | `*/25 * * * *` |
   | 30 minutes | `*/30 * * * *` |
5. **Request method**: `GET`.
6. **Request timeout**: almeno **30 s** (consigliato **60 s** se hai molti iscritti).
7. **Headers** (tab avanzata / Custom headers):

   | Name | Value |
   | --- | --- |
   | `Authorization` | `Bearer IL_TUO_CRON_SECRET` |

   In alternativa accettata dal server:

   | Name | Value |
   | --- | --- |
   | `x-cron-secret` | `IL_TUO_CRON_SECRET` |

8. Salva e abilita il job.

## Risposte attese

| HTTP | Significato |
| --- | --- |
| `200` + `{"ok":true,"sent":0,"pollMinutes":5,...}` | OK (anche se non c’era nulla da inviare). `pollMinutes` riflette **Check interval** in CMS — verifica che coincida con cron-job.org |
| `200` + `skipped: "disabled"` | Avvisi programma spenti in CMS |
| `200` + `skipped: "missing-contact-email"` | Manca **Push contact email** |
| `401` | Secret mancante o errato |
| `5xx` | Errore server — controlla i log Vercel |

cron-job.org segnala fallimenti se la risposta non è 2xx: un `401` indica quasi sempre `CRON_SECRET` non allineato.

## Test manuale

Con il dev server (`pnpm dev`) e `CRON_SECRET` in `.env`:

```bash
pnpm cron:test
```

In produzione:

```bash
CRON_SECRET='...' NEXT_PUBLIC_SERVER_URL='https://tuo-dominio.vercel.app' pnpm cron:test
```

## Quando spegnere il job

- Fuori stagione conferenza, se non servono promemoria.
- Oppure lascialo attivo: con **Enable session alerts** spento il endpoint risponde `200` e non invia nulla.
