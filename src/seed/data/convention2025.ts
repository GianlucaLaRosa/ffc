export type SeedAuthorRole =
  | 'primaryInvestigator'
  | 'partner'
  | 'collaborator'
  | 'teamMember'

export type SeedAbstract = {
  n: number
  session: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  code: string
  relatedCodes?: string[]
  status: 'new' | 'ongoing' | 'concluded'
  title: string
  authors: string[]
  speaker?: string
}

export type SeedInstitution = {
  name: string
  country: string
  region?: string
}

export const CONVENTION_2025_TITLE = '23rd Convention of Investigators in Cystic Fibrosis'

export const CONVENTION_2025_SLUG = '2025-23rd-convention-of-investigators-in-cystic-fibrosis'

export const INSTITUTIONS: SeedInstitution[] = [
  { name: 'Regional Cystic Fibrosis Center, Messina', country: 'Italy', region: 'Sicilia' },
  { name: 'FFC Ricerca scientific direction, Clinical Research Area', country: 'Italy', region: 'Veneto' },
  { name: 'IRCCS San Raffaele Scientific Institute, Milan', country: 'Italy', region: 'Lombardia' },
  { name: 'IRCCS G. Gaslini Institute, Genoa', country: 'Italy', region: 'Liguria' },
  { name: 'IRCCS Ospedale Policlinico San Martino, Genoa', country: 'Italy', region: 'Liguria' },
  { name: 'Fondazione Istituto Italiano di Tecnologia (IIT), Genoa', country: 'Italy', region: 'Liguria' },
  { name: 'University of Zaragoza', country: 'Spain' },
  { name: 'University of Pavia', country: 'Italy', region: 'Lombardia' },
  { name: 'Bambino Gesù Children’s Hospital, Rome', country: 'Italy', region: 'Lazio' },
  { name: 'University of Milan', country: 'Italy', region: 'Lombardia' },
  { name: 'Telethon Institute of Genetics and Medicine (TIGEM), Pozzuoli', country: 'Italy', region: 'Campania' },
  { name: 'University of Trento', country: 'Italy', region: 'Trentino-Alto Adige' },
  { name: 'University of Palermo', country: 'Italy', region: 'Sicilia' },
  { name: 'University of Ferrara', country: 'Italy', region: 'Emilia-Romagna' },
  { name: 'University of Padova', country: 'Italy', region: 'Veneto' },
  { name: 'Azienda Ospedaliera Universitaria Integrata di Verona', country: 'Italy', region: 'Veneto' },
  { name: 'University of Bologna', country: 'Italy', region: 'Emilia-Romagna' },
  { name: 'University of Pisa', country: 'Italy', region: 'Toscana' },
  { name: 'University of Rome Tor Vergata', country: 'Italy', region: 'Lazio' },
  { name: 'Sapienza University of Rome', country: 'Italy', region: 'Lazio' },
  { name: 'University of Perugia', country: 'Italy', region: 'Umbria' },
  { name: 'University of Naples Federico II', country: 'Italy', region: 'Campania' },
  { name: 'KU Leuven', country: 'Belgium' },
  { name: 'University of Lisbon', country: 'Portugal' },
  { name: 'University of Bristol', country: 'United Kingdom' },
  { name: 'McGill University, Montreal', country: 'Canada' },
  { name: 'SINTEF, Trondheim', country: 'Norway' },
  { name: 'University of Alberta, Edmonton', country: 'Canada' },
  { name: 'International Centre for Genetic Engineering and Biotechnology (ICGEB), Trieste', country: 'Italy', region: 'Friuli-Venezia Giulia' },
  { name: 'University of Chieti-Pescara', country: 'Italy', region: 'Abruzzo' },
]

/** Oral abstracts from the 2025 brochure Full Index (PIs as listed). */
export const ABSTRACTS: SeedAbstract[] = [
  {
    n: 1,
    session: 1,
    code: 'Kaftrio in the real life',
    status: 'ongoing',
    title: 'Efficacy and safety of Kaftrio in real life: an observational multicenter Italian clinical study',
    authors: ['Maria Cristina Lucanto', 'Cesare Braggion', 'Cristina Cigana', 'Nicoletta Pedemonte'],
  },
  {
    n: 2,
    session: 1,
    code: 'FFC#2/2024',
    status: 'ongoing',
    title:
      'Investigating the safety of elexacaftor/tezacaftor/ivacaftor (ETI) exposure during pregnancy and early development',
    authors: ['Lucilla Nobbio', 'Andrea Armirotti'],
  },
  {
    n: 3,
    session: 1,
    code: 'FFC#9/2024',
    status: 'ongoing',
    title:
      'Understanding the contribution of Kaftrio to antimicrobial therapies against nontuberculous mycobacteria in cystic fibrosis',
    authors: ['Santiago Ramón-García', 'Daniela Maria Cirillo'],
  },
  {
    n: 4,
    session: 1,
    code: 'MindKids-CF',
    status: 'ongoing',
    title: 'Survey on Mental Health in Children with Cystic Fibrosis',
    authors: [
      'Sonia Graziano',
      'Alexandra Quittner',
      'Rita Pescini',
      'Cristiana Risso',
      'Angela Sepe',
      'Vito Terlizzi',
    ],
  },
  {
    n: 5,
    session: 1,
    code: 'FFC#14/2024',
    status: 'ongoing',
    title: 'Long-term clinical outcomes of insulin secretory defects and effects of CFTR modulators',
    authors: ['Alberto Battezzati', 'Federico Alghisi', 'Stefano Costa'],
  },
  {
    n: 6,
    session: 2,
    code: 'FFC#1/2024',
    status: 'ongoing',
    title: 'Development of new potentiators active on (ultra)rare mutants of CFTR',
    authors: ['Giovanni Marzaro', 'Gergely Lukacs', 'Tamas Hegedus'],
  },
  {
    n: 7,
    session: 2,
    code: 'FFC#3/2024',
    status: 'ongoing',
    title: 'Promoting correct folding to enhance F508del-CFTR rescue induced by correctors',
    authors: ['Mauro Salvi'],
  },
  {
    n: 8,
    session: 2,
    code: 'FFC#2/2023',
    status: 'ongoing',
    title: 'Exploring the cellular pathways to promote rescue of mutant CFTR protein in cystic fibrosis',
    authors: ['Carlos M. Farinha', 'Valeria Tomati'],
  },
  {
    n: 9,
    session: 2,
    code: 'Molecules 3.0 for CF',
    status: 'ongoing',
    title: 'Optimization and in vivo testing of two new classes of modulators and pharmacokinetic studies',
    authors: ['Paola Barraja', 'Luis J. V. Galietta'],
  },
  {
    n: 10,
    session: 2,
    code: 'GMSG#1/2022',
    status: 'ongoing',
    title: 'Development of CRISPR-Cas delivery system for genome editing applications in cystic fibrosis',
    authors: ['Giulia Maule'],
  },
  {
    n: 11,
    session: 2,
    code: 'GenDel-CF',
    status: 'ongoing',
    title: 'Tackling gene delivery in lungs for the treatment of cystic fibrosis',
    authors: [
      'Anna Cereseto',
      'Sven Even Borgos',
      'Luis J. V. Galietta',
      'Sheref Mansy',
      'Serena Zacchigna',
    ],
  },
  {
    n: 12,
    session: 3,
    code: 'FFC#11/2024',
    status: 'ongoing',
    title: 'GY971 as anti-inflammatory agent 2.0',
    authors: ['Ilaria Lampronti', 'Adriana Chilin'],
  },
  {
    n: 13,
    session: 3,
    code: 'FFC#12/2024',
    status: 'ongoing',
    title: 'Targeting immune system to restrain cystic fibrosis airway inflammation',
    authors: ['Domenico Mattoscio'],
  },
  {
    n: 14,
    session: 3,
    code: 'FFC#13/2024',
    status: 'ongoing',
    title: 'Unraveling proresolving effects of CFTR modulators on lung inflammation and infection',
    authors: ['Antonio Recchiuti'],
  },
  {
    n: 15,
    session: 3,
    code: 'FFC#15/2023',
    status: 'ongoing',
    title: 'Melanocortins to control cystic fibrosis airway inflammation',
    authors: ['Mario Romano', 'Mauro Perretti'],
  },
  {
    n: 16,
    session: 3,
    code: 'GMRF#1/2024',
    status: 'ongoing',
    title: 'Airway surface as a battleground against bacteria',
    authors: ['Daniela Guidone'],
  },
  {
    n: 17,
    session: 3,
    code: 'FFC#4/2024',
    status: 'ongoing',
    title:
      'A personalized repurposing approach based on antinflammatory/antioxidant treatment to increase the efficacy of CFTR modulators',
    authors: ['Onofrio Laselva', 'Valeria Capurro', 'Enza Montemitro'],
  },
  {
    n: 18,
    session: 3,
    code: 'De-risking GY',
    status: 'ongoing',
    title: 'Assessing the safety and clinical potential of GY971, an anti-inflammatory compound for cystic fibrosis',
    authors: [
      'Giulio Cabrini',
      'Marco Prosdocimi',
      'Sjoerd Hak',
      'Ilaria Lampronti',
      'Adriana Chilin',
      'Alessandra Bragonzi',
      'Nicoletta Pedemonte',
    ],
  },
  {
    n: 19,
    session: 4,
    code: 'FFC#9/2023',
    relatedCodes: ['FFC#11/2025'],
    status: 'ongoing',
    title: 'Evaluation of the efficacy of the VOMG new antibiotic against Mycobacterium abscessus',
    authors: ['Maria Rosalia Pasca', 'Fabio Saliu'],
  },
  {
    n: 20,
    session: 4,
    code: 'FFC#12/2023',
    status: 'ongoing',
    title: 'Fostering pathogen host-mediated clearance to neutralize Mycobacterium abscessus infection',
    authors: ['Edoardo Scarpa', 'Daniela Maria Cirillo', 'Anna Griego'],
    speaker: 'Anna Griego',
  },
  {
    n: 21,
    session: 4,
    code: 'FFC#10/2024',
    status: 'ongoing',
    title: 'Phenotypic medicinal chemistry approaches to identify new anti-Mycobacterium abscessus agents',
    authors: ['Stefano Sabatini', 'Laura Rindi'],
  },
  {
    n: 22,
    session: 5,
    code: 'CFaCore',
    status: 'ongoing',
    title: 'FFC Ricerca Research facilities: The cystic fibrosis animal core facility',
    authors: ['Alessandra Bragonzi'],
  },
  {
    n: 23,
    session: 5,
    code: 'CFDB',
    status: 'ongoing',
    title: 'FFC Ricerca Research facilities: The cystic fibrosis database',
    authors: ['Roberto Buzzetti', 'Natalia Cirilli'],
  },
  {
    n: 24,
    session: 5,
    code: 'SCP',
    status: 'ongoing',
    title: 'FFC Ricerca Research facilities: The primary cell culture facility',
    authors: ['Valeria Capurro'],
  },
  {
    n: 25,
    session: 5,
    code: 'FFC#1/2025',
    status: 'new',
    title: 'Damage and repair mechanisms in epithelial tissues in cystic fibrosis',
    authors: ['Margarida Amaral', 'Ines Pankonien', 'Emanuela Pesce', 'Emanuel Gonçalves'],
    speaker: 'Ines Pankonien',
  },
  {
    n: 26,
    session: 5,
    code: 'FFC#2/2025',
    status: 'new',
    title: 'An antisense oligonucleotide-based strategy for the rescue of CFTR stop and splicing mutations',
    authors: ['Debora Baroni'],
  },
  {
    n: 27,
    session: 5,
    code: 'FFC#3/2025',
    status: 'new',
    title: 'Optimizing gene therapy and delivery systems for CF untreatable mutations',
    authors: ['Marianne Carlon', 'Anna Cereseto'],
  },
  {
    n: 28,
    session: 5,
    code: 'FFC#4/2025',
    status: 'new',
    title: 'Pharmacological approaches to target nonsense mutations in cystic fibrosis',
    authors: ['Luis J. V. Galietta'],
  },
  {
    n: 29,
    session: 5,
    code: 'FFC#5/2025',
    status: 'new',
    title: 'Characterization of protein kinase D1 as a novel regulator of CFTR trafficking and stability',
    authors: ['Emilio Hirsch'],
  },
  {
    n: 30,
    session: 5,
    code: 'FFC#6/2025',
    status: 'new',
    title: 'Exploring the dual function of Esc peptides and their derivatives as CFTR potentiators and antimicrobial agents',
    authors: ['Maria Luisa Mangoni', 'Loretta Ferrera', 'Mattia Mori'],
  },
  {
    n: 31,
    session: 5,
    code: 'GMSG#1/2025',
    status: 'new',
    title: 'Unconventional approaches to combat cystic fibrosis bacteria',
    authors: ['Marta Mellini'],
  },
  {
    n: 32,
    session: 5,
    code: 'FFC#7/2025',
    status: 'new',
    title: 'Exploiting P. aeruginosa’s zinc dependency to potentiate antibiotic activity',
    authors: ['Andrea Battistoni', 'Luigi Scipione'],
  },
  {
    n: 33,
    session: 5,
    code: 'FFC#10/2025',
    status: 'new',
    title: 'Targeting Pseudomonas aeruginosa virulence factors to counteract infections in cystic fibrosis',
    authors: ['Francesco Imperi', 'Giorgio Giardina', 'Antonio Coluccia'],
  },
  {
    n: 34,
    session: 5,
    code: 'FFC#13/2025',
    status: 'new',
    title: 'Tracking lung infections via gut microbiota',
    authors: ['Cristina Cigana', 'Valeria Daccò', 'Barbara Kahl'],
  },
  {
    n: 35,
    session: 5,
    code: 'FFC#8/2025',
    status: 'new',
    title:
      'Development of a combined therapy with bioactive liposomes encapsulating antibiotics to treat M. abscessus infection',
    authors: ['Maurizio Fraziano', 'Daniela Maria Cirillo'],
  },
  {
    n: 36,
    session: 5,
    code: 'FFC#9/2025',
    status: 'new',
    title: 'Identification of novel drug targets in persistent Mycobacterium abscessus in cystic fibrosis',
    authors: ['Federico Giannoni', 'Riccardo Manganelli'],
  },
  {
    n: 37,
    session: 5,
    code: 'FFC#12/2025',
    status: 'new',
    title: 'Studying the immune system’s response to nontuberculous mycobacterial infections',
    authors: ['Nicola Ivan Lorè'],
  },
  {
    n: 38,
    session: 6,
    code: 'FFC#6/2024',
    status: 'ongoing',
    title:
      'Development of phage therapy for treating Mycobacterium abscessus lung infections in people with cystic fibrosis',
    authors: ['Mariagrazia Di Luca', 'Laura Rindi', 'Andrea Moscatelli'],
  },
  {
    n: 39,
    session: 6,
    code: 'FFC#16/2023',
    status: 'ongoing',
    title:
      'Facing resistance to therapeutic phages observed in Pseudomonas aeruginosa isolates from people with cystic fibrosis',
    authors: ['Federica Briani'],
  },
  {
    n: 40,
    session: 6,
    code: 'GMRF#1/2023',
    status: 'ongoing',
    title:
      'Ex vivo pig lung as a new model to study the efficacy of phage therapy against Pseudomonas aeruginosa infection in cystic fibrosis',
    authors: ['Marco Cafora'],
  },
  {
    n: 41,
    session: 6,
    code: 'FFC#15/2022',
    status: 'concluded',
    title:
      'Study on anti-fungal immunoglobulins, as a potential diagnostic biomarker and therapeutic values for Allergic Bronchopulmonary Aspergillosis in children with cystic fibrosis',
    authors: ['Teresa Zelante'],
  },
  {
    n: 42,
    session: 7,
    code: 'FFC#5/2024',
    status: 'ongoing',
    title: 'Targeting bacterial small RNA to develop non-traditional therapeutic options against Pseudomonas aeruginosa',
    authors: ['Giovanni Bertoni', 'Silvia Ferrara'],
  },
  {
    n: 43,
    session: 7,
    code: 'FFC#7/2024',
    status: 'ongoing',
    title: 'Targeting quorum sensing to fight Pseudomonas aeruginosa infections',
    authors: ['Sandra Gemma', 'Arianna Pompilio'],
  },
  {
    n: 44,
    session: 7,
    code: 'FFC#8/2024',
    status: 'ongoing',
    title: 'A combined therapy against Pseudomonas aeruginosa-Staphylococcus aureus co-infections in cystic fibrosis',
    authors: ['Annalisa Guaragna', 'Eliana De Gregorio'],
  },
  {
    n: 45,
    session: 7,
    code: 'FFC#15/2024',
    status: 'ongoing',
    title:
      'Analysis of the evolution of virulence factors and antimicrobial resistance of Pseudomonas aeruginosa in people with cystic fibrosis',
    authors: ['Martina Rossitto', 'Marco Artini'],
  },
  {
    n: 46,
    session: 7,
    code: 'FFC#6/2023',
    status: 'ongoing',
    title: 'Using a Virtual Screening approach to find new drugs against Pseudomonas aeruginosa and Staphylococcus aureus',
    authors: ['Silvia Buroni', 'Antonio Coluccia'],
  },
  {
    n: 47,
    session: 7,
    code: 'FFC#7/2023',
    status: 'ongoing',
    title: 'Evaluation of cefiderocol activity against Pseudomonas aeruginosa in cystic fibrosis lung infections',
    authors: ['Barbara Citterio', 'Massimiliano Lucidi'],
  },
  {
    n: 48,
    session: 7,
    code: 'FFC#8/2023',
    status: 'ongoing',
    title:
      'Inhalable nanoparticles delivering peptidomimetic/antibiotic combinations for local treatment of CF lung infections',
    authors: ['Eugenio Notomista', "Ivana d'Angelo"],
  },
  {
    n: 49,
    session: 7,
    code: 'FFC#13/2023',
    status: 'ongoing',
    title:
      'Building simple molecules containing regions of Pseudomonas aeruginosa to stimulate the immune system against this pathogen',
    authors: ['Marco Sette', 'Mattia Falconi', 'Marco Rinaldo Oggioni'],
  },
  {
    n: 50,
    session: 8,
    code: 'FFC#3/2023',
    status: 'ongoing',
    title:
      'Understanding the mechanisms behind the variable efficacy of CFTR modulators on the N1303K mutation on human primary nasal epithelial cells',
    authors: ['Renata Bocciardi'],
  },
  {
    n: 51,
    session: 8,
    code: 'GMSG#1/2023',
    status: 'ongoing',
    title:
      'Developing a new respiratory 3D model as an innovative strategy to study the inflammation pathology in cystic fibrosis',
    authors: ['Roberto Plebani'],
  },
  {
    n: 52,
    session: 8,
    code: 'GMSG#1/2024',
    status: 'ongoing',
    title: 'Alternative therapeutic target to restore the mucociliary clearance in CF',
    authors: ['Michele Genovese'],
  },
  {
    n: 53,
    session: 8,
    code: 'FFC#14/2023',
    status: 'ongoing',
    title:
      'Identification of molecular mechanisms which underpin the activation of pathogenic pulmonary Th1/17 cells in cystic fibrosis',
    authors: ['Moira Paroni', 'Clelia Peano'],
  },
  {
    n: 54,
    session: 8,
    code: 'FFC#5/2023',
    status: 'ongoing',
    title: 'Beyond the lung: the gut’s role in the pathology of cystic fibrosis',
    authors: ['Alessandra Bragonzi', 'Federica Ungaro', 'Valeria Daccò'],
  },
]

export const KEYNOTE_SPEAKERS = [
  { firstName: 'Peder Matzen', lastName: 'Berg' },
  { firstName: 'David N.', lastName: 'Sheppard' },
] as const
