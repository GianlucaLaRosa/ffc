const lucide = (name: string) => ({ provider: 'lucide' as const, name })

export const FOOTER_STRUCTURE_SEED = {
  icon: lucide('drafting-compass'),
  label: 'Structure',
  url: 'https://www.google.com',
}

export const FOOTER_DELEGATION_SEED = {
  icon: lucide('smile'),
  label: 'Delegation',
  url: 'https://www.google.com',
}

export { CONVENTION_2025_PARTNERS as FOOTER_PARTNERS_SEED } from './convention2025'

export const FOOTER_CREDITS_SEED = [
  {
    role: 'Editorial Team',
    name: 'Alessandra Ria, Luisa Alessio, Ermanno Rizzi, Federica Lavarini',
  },
  {
    role: 'Graphics and Layout',
    name: 'Porporta ADV - Michela Chesini e Matteo Gallarati',
  },
  {
    role: 'Cover image',
    name: 'Roberto Plebani',
  },
  {
    role: 'Print',
    name: 'November 2025, Grafichecom',
  },
] as const
