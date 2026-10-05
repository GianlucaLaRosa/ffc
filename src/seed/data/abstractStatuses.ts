export const ABSTRACT_STATUS_SEEDS = [
  {
    status: 'new',
    defaultContent: [
      { title: 'Background and rationale' },
      { title: 'Hypothesis and objectives' },
      { title: 'Essential methods' },
      { title: 'Preliminary results' },
      { title: 'Conclusions' },
    ],
  },
  {
    status: 'ongoing',
    defaultContent: [
      { title: 'Background and rationale' },
      { title: 'Hypothesis and objectives' },
      { title: 'Essential methods' },
      { title: 'Preliminary results' },
      { title: 'Conclusions' },
    ],
  },
  {
    status: 'concluded',
    defaultContent: [
      { title: 'Background and rationale' },
      { title: 'Hypothesis and objectives' },
      { title: 'Essential methods' },
      { title: 'Results' },
      { title: 'Conclusions' },
    ],
  },
] as const
