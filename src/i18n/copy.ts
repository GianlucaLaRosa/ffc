/** Bilingual admin chrome. Field `label`s stay English strings. */
export type AdminCopy = { en: string; it: string }

export const copy = (en: string, it: string): AdminCopy => ({ en, it })

export const adminGroups = {
  conferences: copy('Conferences', 'Conferenze'),
  people: copy('People and organisations', 'Persone e organizzazioni'),
  content: copy('Content', 'Contenuti'),
  references: copy('References', 'Riferimenti'),
}
