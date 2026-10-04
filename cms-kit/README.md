# Kit CMS FCR (Payload admin)

Cartella da copiare nell’altro repo (già Next + Payload + Neon). L’AI di destinazione deve seguire **`PLAYBOOK.md`**, non incollare alla cieca `payload.config`.

## Cosa c’è

| Path | Ruolo |
| --- | --- |
| `PLAYBOOK.md` | Istruzioni per l’agente che integra |
| `MANIFEST.md` | Ogni path: copy / merge / skip / adapt |
| `overlay/` | File da copiare così (stessi path sotto `src/`) |
| `reference/` | `payload.config.fcr.ts`, route `(payload)`, baseline migration (**non** applicarla su Neon già migrato) |
| `snippets/` | dipendenze npm, next.config, env |
| `scripts/pack.sh` | Rigenera overlay da questo repo |

## Come usarla

1. In questo repo, se l’overlay è vecchio: `bash cms-kit/scripts/pack.sh`
2. Copia **tutta** `cms-kit/` nell’altro progetto (es. `cms-kit-fcr/`)
3. Chiedi all’AI di integrare seguendo `PLAYBOOK.md` e `MANIFEST.md`
4. Non copiare le pagine pubbliche FCR; lo schema e l’admin stanno nell’overlay

## Non fare

- Applicare `reference/migrations/20261003_180122_baseline.ts` su un database Payload già esistente
- Sovrascrivere in blocco `payload.config.ts`, Users/Media/Footer del target senza il merge descritto nel playbook
- Copiare `payload-types.ts` / `importMap.js` da FCR
