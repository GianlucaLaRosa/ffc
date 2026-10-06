/** Abstract appendix rows from brochure appendix 4 (Italian; Title + Body). */
export type SeedAbstractAppendix = { title: string; body: string[] }

export const ABSTRACT_APPENDICES: Record<string, SeedAbstractAppendix> = {
  'Kaftrio in the real life': {
    title:
      'PROGETTO STRATEGICO FFC RICERCA 2023-2025. KAFTRIO NELLA VITA REALE. Efficacia e sicurezza di Kaftrio nella vita reale: studio italiano osservazionale e multicentrico',
    body: [
      'Responsabile: Cesare Braggion (Direzione Scientifica, Area Ricerca Clinica FFC Ricerca).',
      'Ricercatore principale: Maria Cristina Lucanto (Centro Regionale di Riferimento per la Fibrosi Cistica di Messina).',
      'Finanziamento: 328.000 €.',
      'Adottato totalmente da: Gruppo di sostegno FFC Ricerca Miriam Colombo – Ospedaletti (€ 50.000); Delegazione FFC Ricerca di Genova (€ 50.000); Delegazione FFC Ricerca di Brindisi Torre (€ 30.000); Delegazione FFC Ricerca di Milano (€ 100.000); Delegazione FFC Ricerca di Napoli (€ 52.000); Delegazione FFC Ricerca Cosenza Sud (€ 8.000); Delegazione FFC Ricerca della Valpolicella (€ 30.000); Delegazione FFC Ricerca di Roma Pomezia (€ 8.000).',
    ],
  },
  'FFC#2/2024': {
    title: 'FFC#2/2024 - Studio sulla sicurezza di Kaftrio in gravidanza e in giovane età',
    body: [
      'Responsabile: Andrea Armirotti (Analytical Chemistry Facility, Istituto italiano di tecnologia, Genova).',
      'Finanziamento: 208.425 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca Miriam Colombo Ospedaletti – Imperia (€ 15.000); Delegazione FFC Ricerca di Genova “Mamme per la ricerca” (€ 100.000); Delegazione FFC Ricerca di Rovigo (€ 20.000); Delegazione FFC Ricerca di Milano (€ 40.000); Delegazione FFC Ricerca di Catania Paternò (€ 33.425).',
    ],
  },
  'FFC#9/2024': {
    title:
      'FFC#9/2024 - Il contributo di Kaftrio alle terapie contro i micobatteri non tubercolari in fibrosi cistica',
    body: [
      'Responsabile: Santiago Ramón García (ARAID Foundation, Dipartimento di microbiologia, Università di Zaragoza, Spagna).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca “Il sogno di Aiden” (€ 50.000); Amici della ricerca (€ 16.000); Delegazione FFC Ricerca di Vittoria Ragusa (€ 35.250); Delegazione FFC Ricerca di Catania Mascalucia (€ 35.250).',
    ],
  },
  'MindKids-CF': {
    title: 'MindKids-CF - Indagine sulla salute mentale nei bambini con fibrosi cistica',
    body: [
      'Responsabile: Sonia Graziano (Unità di Psicologia – Unità di Neuropsichiatria dell’infanzia e dell’Adolescenza, Ospedale Pediatrico Bambino Gesù IRCCS, Roma).',
      'Finanziamento: 169.596 €.',
      'Adottato da: Delegazione FFC Ricerca di Nichelino e Moncalieri (€ 10.000); Delegazione FFC Ricerca di Napoli (€ 30.000); Delegazione FFC Ricerca di Campiglione Fenile – Torino (€ 10.000); Delegazione FFC Ricerca di Cecina e Rosignano – Livorno (€ 10.000); Latteria Montello (€ 15.000).',
      'Adottabile per 94.596 €.',
    ],
  },
  'FFC#14/2024': {
    title:
      'FFC#14/2024 - Conseguenze a lungo termine della carenza di secrezione di insulina ed effetti dei modulatori di CFTR',
    body: [
      'Responsabile: Alberto Battezzati (Dipartimento di Scienze per gli Alimenti, la Nutrizione e l’Ambiente, Università degli Studi di Milano).',
      'Finanziamento: 42.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Palo del Colle (€ 42.000).',
    ],
  },
  'FFC#1/2024': {
    title:
      'FFC#1/2024 - Ottimizzazione di nuovi potenziatori attivi su mutazioni (ultra)rare di CFTR che non rispondono alle terapie farmacologiche disponibili',
    body: [
      'Responsabile: Giovanni Marzaro (Dip. di Scienze del farmaco, Università di Padova).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Acqui Terme (€ 100.000); Delegazione FFC Ricerca di Vicenza (€ 36.500).',
    ],
  },
  'FFC#3/2024': {
    title:
      'FFC#3/2024 - Promuovere il corretto ripiegamento della proteina CFTR mutata per potenziare l’azione dei correttori',
    body: [
      'Responsabile: Mauro Salvi (Dipartimento di Scienze Biomediche, Università degli Studi di Padova).',
      'Finanziamento: 63.525 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca Fibrosirun Monza Brianza (€ 63.525).',
    ],
  },
  'FFC#2/2023': {
    title:
      'FFC#2/2023 - Esplorare i percorsi cellulari della proteina CFTR mutata per potenziarne il recupero',
    body: [
      'Responsabile: Carlos M. Farinha (BioISI - Biosystems and Integrative Sciences Institute, University of Lisboa, Portugal).',
      'Finanziamento: 136.465 €.',
      'Adottato totalmente da: Gruppo di sostegno FFC Ricerca di Vimercate - in ricordo di Gloria (€ 94.000); Armito Teatro - Delegazione FFC Ricerca di Genova “Mamme per la ricerca” (€ 12.000); Delegazione FFC Ricerca di Nichelino e Moncalieri (€ 30.465).',
    ],
  },
  'Molecules 3.0 for CF': {
    title:
      'PROGETTO STRATEGICO FFC RICERCA 2023-2025. MOLECOLE 3.0 PER LA FIBROSI CISTICA. FASE 4. Nuovi modulatori farmacologici per il recupero della proteina CFTR mutata',
    body: [
      'Responsabili: Paola Barraja (STEBICEF - Laboratorio di sintesi degli eterocicli, Università di Palermo); Luis Galietta (Istituto Telethon di Genetica e Medicina – TIGEM, Pozzuoli, Napoli).',
      'Adottato totalmente da: Delegazione FFC Ricerca di Palermo e Trapani (€ 50.000); Rotary Distretto 2060 (€ 28.000); Gruppo di sostegno FFC Ricerca di Matera (€ 12.000); Delegazione FFC Ricerca di Treviso Montebelluna (€ 20.000); Imprese Unite per la Ricerca (€ 20.000); I migliori amici della ricerca 2024 (€ 27.792,60); Associazione Un sogno per vincere (€ 8.000); Rotary Distretto 2060 (€ 21.000); I migliori amici della ricerca 2025 (€ 3.257,40).',
    ],
  },
  'GMSG#1/2022': {
    title:
      'GMSG#1/2022 - Sviluppo di sistemi di trasporto per la tecnologia CRISPR-Cas per la cura della fibrosi cistica',
    body: [
      'Responsabile: Giulia Maule (Dip. di Biologia Cellulare, Computazionale e Integrata CIBIO, Università di Trento).',
      'Finanziamento: 149.000 €.',
      'Adottto totalmente da: Delegazione FFC Ricerca Val d’Alpone (€ 80.000); Together for Life (€ 69.000).',
    ],
  },
  'GenDel-CF': {
    title:
      'PROGETTO STRATEGICO FFC RICERCA 2024-2027. GENDEL-CF. Strategie di trasferimento genico nei polmoni per il trattamento della fibrosi cistica',
    body: [
      'Responsabile: Anna Cereseto (Dipartimento CIBIO dell’Università di Trento).',
      'Finanziamento: 1.870.207 €.',
      'Adottato da: Lascito Anna Cantelli (€ 490.000); Delegazione FFC Ricerca di Imola e Romagna (€ 100.000); Gruppo di sostegno FFC Ricerca “Insieme per Giulia Sofia” (€ 20.000); Delegazione FFC Ricerca di Alberobello (€ 30.000), Delegazione FFC Ricerca di Torino (€ 30.000), Delegazione FFC Ricerca di Verbania e V.C.O. (€ 10.000), Doniamoci - Fundraising Dinner (€ 42.000), Delegazione FFC Ricerca di Reggello Firenze (€ 30.000), Associazione Fibrosi Cistica Alto Adige ODV (€ 35.000), Delegazione FFC Ricerca di Vicenza (€ 50.000), Loifur Srl (€ 14.000), Lega Italiana Fibrosi Cistica Emilia - Onlus (€ 30.000), Project Hope - Rosa Pastena (€ 12.000), Delegazione FFC Ricerca Val d’Alpone (€ 60.000), MinervaHub per la ricerca (€ 10.000), Parker (€ 27.650), Delegazione FFC Ricerca di Palermo e Trapani (€ 50.000), Delegazione FFC Ricerca di Bolzano (€ 20.000), Imprese unite per la ricerca (€ 19.557), Delegazione FFC Ricerca di Vercelli (€ 30.000), Delegazione FFC Ricerca di Imola e Romagna (€ 80.000), Delegazione FFC Ricerca della Valpolicella (€ 45.000), Antonio Guadagnin & Figlio srl (€ 10.000), Delegazione FFC Ricerca di Verbania (€ 14.000), Delegazione FFC Ricerca di Napoli con il Gruppo di Sostegno FFC Ricerca di Vitulazio (€ 50.000), Associazione Trentina “Dedicato a Efrem Gottoli” (€ 60.000), Delegazione FFC Ricerca di Messina (€ 15.000) La Chiave della Vita – In ricordo di Laura (€ 50.000); Delegazione FFC Ricerca del Lago di Garda (€ 200.000); Doniamoci – Fundraising Dinner (€ 86.000); Delegazione FFC Ricerca “Insieme per Giulia Sofia” – Cuneo (€ 20.000); Delegazione FFC Ricerca Melilli Siracusa (€ 40.000); Asta stellare Dallara – Intesa Sanpaolo (€ 70.000); Ass. Fino all’ultimo respiro ODV ETS (€ 10.000); CrowdForLife – Crédit Agricole Italia (€ 10.000).',
    ],
  },
  'FFC#11/2024': {
    title: 'FFC#11/2024 - GY971 come agente anti-infiammatorio 2.0',
    body: [
      'Responsabile: Ilaria Lampronti (Dipartimento di Scienze della vita e biotecnologie, Università degli Studi di Ferrara).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Treviso Montebelluna “Bottega delle donne” (€ 40.000); Delegazione FFC Ricerca di Ferrara (€ 10.000); Delegazione FFC Ricerca di Torino (€ 20.000); Delegazione FFC Ricerca di Massafra (€ 66.500).',
    ],
  },
  'FFC#12/2024': {
    title:
      'FFC#12/2024 - Agire sul sistema immunitario per spegnere l’infiammazione delle vie aeree in fibrosi cistica',
    body: [
      'Responsabile: Domenico Mattoscio (Dipartimento di Scienze Mediche, Orali e Biotecnologiche, Università degli Studi “G. d’Annunzio” Chieti - Pescara).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Como Dongo (€ 80.000); Delegazione FFC Ricerca di Codogno e Piacenza (€ 20.000); Gruppo di sostegno FFC Ricerca di Martinsicuro Teramo (€ 12.000); Delegazione FFC Ricerca di Novara (€ 8.000); Delegazione FFC Ricerca di Pavia (€ 8.000); Delegazione FFC Ricerca di Ascoli Piceno (€ 20.000); Gruppo di sostegno FFC Ricerca di Reggio Emilia (€ 8.000); Delegazione FFC Ricerca di Lecce (€ 25.000); Gruppo di sostegno FFC Ricerca di Asti (€ 29.000).',
    ],
  },
  'FFC#13/2024': {
    title:
      'FFC#13/2024 - Comprendere il ruolo dei modulatori di CFTR sulla risoluzione dell’infiammazione e delle infezioni nelle persone con fibrosi cistica',
    body: [
      'Responsabile: Antonio Recchiuti (Università degli Studi “G. d’Annunzio” Chieti - Pescara, Dip. Scienze Mediche, Orali e Biotecnologiche).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Cerea “Il sorriso di Jenny” (€ 8.000); Gruppo di sostegno FFC Ricerca di Grado – Gorizia (€ 8.000); Gruppo di sostegno FFC Ricerca della Val Seriana (€ 25.000); Delegazione FFC Ricerca di Reggello con Delegazione FFC Ricerca di Siena (€ 25.000); Gruppo di sostegno FFC Ricerca di Vimercate – In ricordo di Gloria (€ 8.000); Gruppo di sostegno FFC Ricerca di Magenta (€ 10.000); Gruppo di sostegno FFC Ricerca di Sondrio Tresivio Ponte "In ricordo di Teresa" (€ 8.000); Delegazione FFC Ricerca di Franciacorta e Valcamonica (€ 36.500); Gruppo di sostegno Bari Santeramo in Colle (€ 8.000).',
    ],
  },
  'FFC#15/2023': {
    title: 'FFC#15/2023 - Melanocortine per controllare l’infiammazione nella fibrosi cistica',
    body: [
      'Responsabile: Mario Romano (Dip. di Scienze Mediche, Orali e Biotecnologiche, Università G. d’Annunzio di Chieti-Pescara).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Treviso Montebelluna (€ 30.000); Delegazione FFC Ricerca di Pesaro - Delegazione FFC Ricerca di Parma Fidenza - Delegazione FFC Ricerca di Torino Rivarolo Canavese (€ 80.000); Delegazione FFC Ricerca di PescaraGruppo di sostegno FFC Ricerca della Valle Peligna e della Marsica (€ 10.000); LIFC Abruzzo (€ 16.500).',
    ],
  },
  'GMRF#1/2024': {
    title: 'GMRF#1/2024 - La superficie delle vie aeree come campo di battaglia contro i batteri',
    body: [
      'Responsabile: Daniela Guidone (TIGEM, Pozzuoli, Napoli).',
      'Finanziamento: 52.500 €.',
      'Adottato totalmente da: La Mano Tesa Onlus (€ 52.500).',
    ],
  },
  'FFC#4/2024': {
    title:
      'FFC#4/2024 - Un approccio di terapia personalizzata con antinfiammatori e antiossidanti per aumentare l’efficacia dei modulatori di CFTR',
    body: [
      'Responsabile: Onofrio Laselva (Dipartimento di Medicina Clinica e Sperimentale, Università degli Studi di Foggia).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca Valle Scrivia Alessandria (€ 16.000); Delegazione FFC Ricerca di Roma Pomezia (€ 20.000); Delegazione FFC Ricerca di Vicenza (€ 45.500); Delegazione FFC Ricerca di Alberobello con volontari di Noci (€ 30.000); Delegazione FFC Ricerca di Latina (€ 25.000).',
    ],
  },
  'FFC#9/2023': {
    title:
      'FFC#9/2023 - Valutazione dell’efficacia del nuovo antibiotico “VOMG” contro Mycobacterium abscessus',
    body: [
      'Responsabile: Maria Rosalia Pasca (Dip. di Biologia e Biotecnologie Lazzaro Spallanzani, Università degli Studi di Pavia).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Donazione Carolina Sabatini (€ 35.000); Delegazione FFC Ricerca di Siniscola Nuoro (€ 50.000); Gruppo di sostegno FFC Ricerca di Casale Monferrato (€ 8.000); Delegazione FFC Ricerca della Valdadige (€ 18.000); Delegazione FFC Ricerca di Crevalcore (€ 25.500).',
    ],
  },
  'FFC#11/2025': {
    title:
      'FFC#11/2025 - Sviluppo di una nuova formulazione di VOMG per il trattamento delle infezioni da Mycobacterium abscessus',
    body: [
      'Responsabile: Maria Rosalia Pasca (Dipartimento di Biologia e Biotecnologia Lazzaro Spallanzani, Università degli Studi di Pavia).',
      'Finanziamento: 73.500 €.',
      'Adottato da: Delegazione FFC Ricerca di Napoli (€ 46.826); Delegazione FFC Ricerca di Latina (€ 15.000).',
      'Adottabile per 11.674 €.',
    ],
  },
  'FFC#12/2023': {
    title:
      'FFC#12/2023 - Rieducare il sistema immunitario dell’ospite a neutralizzare l’infezione da Mycobacterium abscessus',
    body: [
      'Responsabile: Edoardo Scarpa (Dip. di Scienze Farmaceutiche, Università degli Studi di Milano).',
      'Finanziamento: 136.500 €.',
      'Adottato da: Delegazione FFC Ricerca di Firenze (€ 15.000); Delegazione FFC Ricerca di Ascoli Piceno (€ 30.000); “Respiri” charity dinner Voce – Aimo e Nadia (€ 47.000); Delegazione FFC Ricerca di Fabriano Ancona (€ 24.500).',
    ],
  },
  'FFC#10/2024': {
    title:
      'FFC#10/2024 - Approcci chimico-farmaceutici per identificare nuovi agenti anti-Mycobacterium abscessus',
    body: [
      'Responsabile: Stefano Sabatini (Dipartimento di Scienze Farmaceutiche, Università degli Studi di Perugia).',
      'Finanziamento: 89.250 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Alba Cuneo.',
    ],
  },
  'FFC#1/2025': {
    title:
      'FFC#1/2025 - I meccanismi di danno e riparazione nei tessuti epiteliali della fibrosi cistica',
    body: [
      'Responsabile: Margarida Amaral and Ines Pankonien (Cystic Fibrosis Research Lab, BioISI–Biosystems & Integrative Sciences Institute, Facoltà di Scienze, Università di Lisbona, Portogallo).',
      'Finanziamento: 209.897 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca Miriam Colombo Ospedaletti – Imperia (€ 15.000); Gruppo di sostegno FFC Ricerca di Reggio Emilia (€ 20.000); Gruppo di sostegno di Seregno – Monza Brianza (€ 15.000); Delegazione FFC Ricerca Fibrosirun – Monza Brianza (€ 80.352); Delegazione FFC Ricerca “Il sogno di Aiden” Brescia (€ 40.000); Delegazione FFC Ricerca di Verbania e V.C.O. (€ 20.000); Gruppo di sostegno FFC Ricerca di Matera (€ 19.545,00).',
    ],
  },
  'FFC#2/2025': {
    title:
      'FFC#2/2025 - Uso di oligonucleotidi antisenso per il recupero funzionale di CFTR con mutazioni stop e di splicing',
    body: [
      'Responsabile: Debora Baroni (Istituto di Biofisica, CNR, Genova).',
      'Finanziamento: 173.250 €.',
      'Adottato totalmente da: Ass.ne Trentina Fibrosi Cistica ODV “In ricordo di Francesco Pelz” (€ 90.000); Delegazione FFC Ricerca di Vicenza (€ 50.000); Delegazione FFC Ricerca di Napoli (€ 33.250).',
    ],
  },
  'FFC#3/2025': {
    title:
      'FFC#3/2025 - Ottimizzazione della terapia genica e dei sistemi di trasporto per mutazioni ancora prive di terapia',
    body: [
      'Responsabile: Marianne Carlon (Laboratory of Respiratory Thoracic Surgery, KU Leuven, Belgio).',
      'Finanziamento: 209.998 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca “Alla fine esce sempre il sole” Boschi Sant’Anna Minerbe – Verona (€ 40.000); Delegazione FFC Ricerca “Il sorriso di Jenny” Cerea – Verona (€ 8.000); Delegazione FFC Ricerca di Torino (€ 30.000); Delegazione FFC Ricerca di Padova (€ 35.000); Delegazione FFC Ricerca di Alberobello – Bari con volontari di Noci (€ 50.000); Guadagnin Srl (€ 8.000); Delegazione FFC Ricerca di Vimercate - Monza Brianza (€ 20.000); Gruppo di sostegno FFC Ricerca di Martinsicuro - Teramo (€ 18.998).',
    ],
  },
  'FFC#4/2025': {
    title:
      'FFC#4/2025 - Approcci farmacologici per la correzione delle mutazioni stop in fibrosi cistica',
    body: [
      'Responsabile: Luis J. V. Galietta (Università degli Studi di Napoli Federico II – Istituto Telethon di Genetica e Medicina TIGEM, Pozzuoli, Napoli).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Piazzalunga srl (€ 180.000); Delegazione FFC Ricerca di Napoli (€ 10.000); Delegazione FFC Ricerca di Vitulazio – Caserta (€ 10.000); Gruppo di sostegno FFC Ricerca “Insieme per Costantino e Francesco” Serino – Avellino (€ 10.000).',
    ],
  },
  'FFC#5/2025': {
    title:
      'FFC#5/2025 - Caratterizzazione della proteina chinasi D1 come regolatore del traffico e della stabilità di CFTR',
    body: [
      'Responsabile: Emilio Hirsch (Dipartimento di Biotecnologia Molecolare e Scienze della Salute, Università di Torino).',
      'Finanziamento: 135.975 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Nichelino e Moncalieri (€ 30.000); Delegazione FFC Ricerca di Milano (€ 50.000); Delegazione FFC Ricerca di Campiglione Fenile – Torino (€ 20.000); Delegazione FFC Ricerca di Valpolicella (€ 35.975).',
    ],
  },
  'FFC#6/2025': {
    title:
      'FFC#6/2025 - Approfondire la doppia funzione dei peptidi Esc e loro derivati come potenziatori e agenti antimicrobici',
    body: [
      'Responsabile: Maria Luisa Mangoni (Dipartimento di Scienze Biochimiche, Università La Sapienza, Roma).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Gruppo di sostegno FFC Ricerca di Scauri – Minturno (€ 8.000); Delegazione FFC Ricerca di Moncalvo – Asti (€ 20.000); Delegazione FFC Ricerca di Dongo Como (€ 108.500).',
    ],
  },
  'GMSG#1/2025': {
    title:
      'GMSG#1/2025 - Approcci non convenzionali per combattere i batteri della fibrosi cistica',
    body: [
      'Responsabile: Marta Mellini (Laboratorio di Biotecnologie dei Microrganismi, Dipartimento di Scienze, Università Roma Tre).',
      'Finanziamento: 177.450 €.',
      'Adottato da: Delegazione FFC Ricerca “La bottega delle Donne” Montebelluna – Treviso (€ 25.000); Delegazione FFC Ricerca di Ghedi – Brescia (€ 40.000); Programma “I migliori amici della ricerca” (€ 22.000).',
      'Adottabile per 90.450 €.',
    ],
  },
  'FFC#7/2025': {
    title:
      'FFC#7/2025 - Sfruttare la dipendenza di P. aeruginosa dallo zinco per potenziare l’attività degli antibiotici',
    body: [
      'Responsabile: Andrea Battistoni (Dipartimento di Biologia, Università di Roma Tor Vergata).',
      'Finanziamento: 105.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca della Franciacorta e Val Camonica – Brescia.',
    ],
  },
  'FFC#10/2025': {
    title:
      'FFC#10/2025 - Inibire i fattori di virulenza di Pseudomonas aeruginosa per contrastare le infezioni',
    body: [
      'Responsabile: Francesco Imperi (Dipartimento di Scienze, Università Roma Tre).',
      'Finanziamento: 63.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Imola e Romagna.',
    ],
  },
  'FFC#13/2025': {
    title:
      'FFC#13/2025 - Monitoraggio delle infezioni polmonari attraverso i microrganismi intestinali',
    body: [
      'Responsabile: Cristina Cigana (Unità Infezioni e Fibrosi Cistica, divisione di Immunologia, Trapianti e Malattie Infettive, Istituto San Raffaele Milano).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Mascalucia Catania (€ 68.250); Delegazione FFC Ricerca di Vittoria, Ragusa e Siracusa (€ 68.250).',
    ],
  },
  'FFC#8/2025': {
    title:
      'FFC#8/2025 - Sviluppo di una terapia combinata con antibiotici incapsulati in liposomi bioattivi per trattare l’infezione da M. abscessus',
    body: [
      'Responsabile: Maurizio Fraziano (Dipartimento di Biologia, Università di Roma Tor Vergata).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Pomezia – Roma (€ 15.000); Programma “I migliori amici della ricerca” (€ 30.000); Delegazione FFC Ricerca di Alba Cuneo (€ 91.500).',
    ],
  },
  'FFC#9/2025': {
    title:
      'FFC#9/2025 - Identificazione di nuovi bersagli nel trattamento delle forme persistenti di Mycobacterium abscessus in fibrosi cistica',
    body: [
      'Responsabile: Federico Giannoni (Dipartimento di Malattie Infettive, Istituto Superiore di Sanità, Roma).',
      'Finanziamento: 73.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Crevalcore (€ 40.000); Delegazione FFC Ricerca di Milano (€ 25.000); Gruppo di sostegno FFC Ricerca di Casarile - Milano (€ 8.500).',
    ],
  },
  'FFC#12/2025': {
    title:
      'FFC#12/2025 - Studiare la risposta del sistema immunitario nelle infezioni polmonari da micobatteri non tubercolari',
    body: [
      'Responsabile: Nicola Ivan Lorè (Unità Patogeni Batterici Emergenti, Divisione di Immunologia, Trapianti e Malattie Infettive, IRCCS San Raffaele, Milano).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca “Correre per un respiro” (€ 75.000); Delegazione FFC Ricerca di Roma Pomezia (€ 30.000); Delegazione FFC Ricerca di Morbegno - Sondrio (€ 31.500).',
    ],
  },
  'FFC#6/2024': {
    title:
      'FFC#6/2024 - Avanzamenti della terapia fagica per il trattamento di infezioni batteriche polmonari da Mycobacterium abscessus in persone con fibrosi cistica',
    body: [
      'Responsabile: Mariagrazia Di Luca (Dipartimento di Biologia, Università degli Studi di Pisa).',
      'Finanziamento: 135.450 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Napoli con Gruppo di sostegno FFC Ricerca di Vitulazio (€ 30.000); Delegazione FFC Ricerca di Saviano (€ 30.000); Iniziativa #CorrerePerUnRespiro promossa dalla Delegazione FFC Ricerca di Milano (€ 75.450).',
    ],
  },
  'FFC#16/2023': {
    title:
      'FFC#16/2023 - Affrontare la resistenza alla terapia fagica di batteri Pseudomonas aeruginosa isolati da persone con fibrosi cistica',
    body: [
      'Responsabile: Federica Briani (Dip. di Bioscienze, Università degli Studi di Milano).',
      'Finanziamento: 113.085 €.',
      'Adottato totalmente da: Gruppo di sostegno FFC Ricerca di Saviano (€ 30.000); Delegazione FFC Ricerca di Sondrio Valchiavenna (€ 40.000); Delegazione FFC Ricerca di Milano (€ 43.085).',
    ],
  },
  'GMRF#1/2023': {
    title:
      'GMRF#1/2023 - Espianti di polmone di maiale come nuovo modello per testare la terapia fagica contro infezioni da Pseudomonas aeruginosa in fibrosi cistica',
    body: [
      'Responsabile: Marco Cafora (Dip. Biotecnologie mediche e Medicina translazionale, Università degli Studi di Milano).',
      'Finanziamento: 105.000 €.',
      'Adottato da: Donatori regolari FFC Ricerca (€ 70.000), Delegazione FFC Ricerca di Novara (€ 8.000), Delegazione FFC Ricerca di Belluno (€ 27.000).',
    ],
  },
  'FFC#15/2022': {
    title:
      'FFC#15/2022 - Usare gli anticorpi come potenziali biomarcatori per la diagnosi e la terapia dell’aspergillosi broncopolmonare allergica nei bambini con fibrosi cistica',
    body: [
      'Responsabile: Teresa Zelante (Dip. di Medicina e Chirurgia, Università degli Studi di Perugia).',
      'Finanziamento: 130.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Verbania e V.C.O. (€ 10.000); Delegazione FFC Ricerca di Fermo (€ 12.000); Delegazione FFC Ricerca di Fabriano Ancona (€ 12.000); Delegazione FFC Ricerca della Valpolicella (€ 36.000); Delegazione FFC Ricerca di Tradate Gallarate (€ 60.000).',
    ],
  },
  'FFC#5/2024': {
    title:
      'FFC#5/2024 - Sviluppo di terapie non tradizionali contro Pseudomonas aeruginosa agendo su piccoli RNA batterici',
    body: [
      'Responsabile: Giovanni Bertoni (Dipartimento di Bioscienze, Università degli Studi di Milano).',
      'Finanziamento: 73.290 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca della Franciacorta e Val Camonica (€ 73.290).',
    ],
  },
  'FFC#7/2024': {
    title:
      'FFC#7/2024 - Interrompere la comunicazione tra batteri, o quorum sensing, per contrastare le infezioni di Pseudomonas aeruginosa',
    body: [
      'Responsabile: Sandra Gemma (Dipartimento di Biotecnologie, Chimica e Farmacia, Università degli Studi di Siena).',
      'Finanziamento: 135.450 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Manciano Grosseto (€ 12.000); Delegazione FFC Ricerca di Verona (€ 20.000); Delegazione FFC Ricerca di Moncalvo Asti (€ 35.000); Delegazione FFC Ricerca di Crevalcore (€ 28.450); Delegazione FFC Ricerca di Fermo (€ 10.000); Delegazione FFC Ricerca di Milano - Milano Marathon (€ 30.000).',
    ],
  },
  'FFC#8/2024': {
    title:
      'FFC#8/2024 - Una terapia combinata contro le co-infezioni da Pseudomonas aeruginosa e Staphylococcus aureus in fibrosi cistica',
    body: [
      'Responsabile: Annalisa Guaragna (Dipartimento Scienze Chimiche, Università Federico II, Napoli).',
      'Finanziamento: 195.300 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Tradate Gallarate (€ 100.000); Delegazione FFC Ricerca “Un fiore per Valeria” Assemini – Cagliari (€ 12.000); Delegazione FFC Ricerca di Monterotondo Roma (€ 20.000); Delegazione FFC Ricerca di Benevento (€ 8.000); Delegazione FFC Ricerca di Cosenza Sud (€ 8.000); Gruppo di sostegno FFC Ricerca di Seregno (€ 16.000); Delegazione FFC Ricerca di Altamura (€ 8.000); Gruppo di sostegno FFC Ricerca di Isili – Cagliari (€ 23.300).',
    ],
  },
  'FFC#15/2024': {
    title:
      'FFC#15/2024 - Analisi dell’evoluzione dei fattori di virulenza e della resistenza antimicrobica di Pseudomonas aeruginosa in persone con fibrosi cistica',
    body: [
      'Responsabile: Martina Rossitto (IRCCS Ospedale Pediatrico Bambino Gesù, Roma).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Belluno (€ 90.000); Delegazione FFC Ricerca di Roma (€ 30.000); Delegazione FFC Ricerca di Sondrio Valchiavenna (€ 30.000); Delegazione FFC Ricerca di Lucca (€ 45.000); Latteria Montello (€ 15.000).',
    ],
  },
  'FFC#6/2023': {
    title:
      'FFC#6/2023 - Individuare nuovi farmaci contro Pseudomonas aeruginosa e Staphylococcus aureus mediante l’approccio di screening virtuale',
    body: [
      'Responsabile: Silvia Buroni (Dip. Biologia e Biotecnologie “Lazzaro Spallanzani”, Università di Pavia).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Campiglione Fenile (€ 40.000); Delegazione FFC Ricerca Valle Scrivia Alessandria (€ 16.000); Delegazione FFC Ricerca di Vigevano (€ 30.000), Delegazione FFC Ricerca di Boschi Sant’Anna Minerbe “Alla fine esce sempre il sole” (€ 40.000), Delegazione FFC Ricerca di Lecco Valsassina (€ 59.000), Delegazione FFC Ricerca di Padova (€ 25.000).',
    ],
  },
  'FFC#7/2023': {
    title:
      'FFC#7/2023 - Valutazione del potenziale dell’antibiotico cefiderocol su Pseudomonas aeruginosa per il trattamento delle infezioni polmonari in fibrosi cistica',
    body: [
      'Responsabile: Barbara Citterio (Dip. Scienze Biomolecolari e Biotecnologiche, Università di Urbino).',
      'Finanziamento: 126.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Ferrara (€ 10.000); Delegazione FFC Ricerca di Belluno (€ 12.000); Adare Pharma Solutions (€ 12.000), Delegazione FFC Ricerca di Cecina e Rosignano (€ 24.000); Amici della ricerca (€ 20.000); Delegazione FFC Ricerca di Prato (€ 28.000); Delegazione FFC Ricerca di Pavia (€ 20.000).',
    ],
  },
  'FFC#8/2023': {
    title:
      'FFC#8/2023 - Nanoparticelle inalabili per la somministrazione di combinazioni di molecole antimicrobiche nel trattamento delle infezioni polmonari in fibrosi cistica',
    body: [
      'Responsabile: Eugenio Notomista (Dip. Biologia Strutturale e Funzionale, Università Federico II, Napoli).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Napoli (€ 32.000); Gruppo di sostegno FFC Ricerca di Vitulazio (€ 8.000); Associazione Trentina Fibrosi Cistica Odv - In ricordo di Maria Gardumi e Alba Leveghi (€ 20.000); Delegazione FFC Ricerca di Vittoria Ragusa e Siracusa (€ 76.500).',
    ],
  },
  'FFC#13/2023': {
    title:
      'FFC#13/2023 - Costruire strutture derivate da Pseudomonas aeruginosa per stimolare il sistema immunitario dell’ospite contro il batterio',
    body: [
      'Responsabile: Marco Sette (Dip. di Scienze e Tecnologie Chimiche, Università di Roma “Tor Vergata”).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca del Lago di Garda.',
    ],
  },
  'FFC#3/2023': {
    title:
      'FFC#3/2023 - Studio dei meccanismi alla base della variabilità di risposta ai modulatori di CFTR della mutazione N1303K su cellule nasali primarie',
    body: [
      'Responsabile: Renata Bocciardi (Dip. di neuroscienze, riabilitazione, oftalmologia, genetica e scienze materno-infantili - DINOGMI, Università degli Studi di Genova).',
      'Finanziamento: 135.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Genova “Mamme per la ricerca” (€ 60.000); Delegazione FFC Ricerca di Tradate Gallarate (€ 76.500).',
    ],
  },
  'GMSG#1/2023': {
    title:
      'GMSG#1/2023 - Messa a punto di un modello 3D di tessuto respiratorio per studiare l’infiammazione in fibrosi cistica',
    body: [
      'Responsabile: Roberto Plebani (Dip. di Scienze Mediche, Orali e Biotecnologiche, Università G. d’Annunzio di Chieti-Pescara).',
      'Finanziamento: 159.162 €.',
      'Adottato totalmente da: Together for life.',
    ],
  },
  'GMSG#1/2024': {
    title:
      'GMSG#1/2024 - Studio di bersagli terapeutici alternativi per ripristinare la clearance mucociliare delle vie aeree FC',
    body: [
      'Responsabile: Michele Genovese (TIGEM, Pozzuoli, Napoli).',
      'Finanziamento: 189.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Siniscola Nuoro (€ 50.000); Delegazione FFC Ricerca di Lodi (€ 16.000); Delegazione FFC Ricerca di Bologna (€ 123.000).',
    ],
  },
  'FFC#14/2023': {
    title:
      'FFC#14/2023 - Identificazione dei meccanismi molecolari che portano all’attivazione delle cellule immunitarie Th1/17 patogeniche in fibrosi cistica',
    body: [
      'Responsabile: Moira Paroni (Dip. di Bioscienze, Università degli Studi di Milano).',
      'Finanziamento: 210.000 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Codogno e Piacenza (€ 10.000); Delegazione FFC Ricerca di Vercelli (€ 30.000); Delegazione FFC Ricerca della Franciacorta e Val Camonica (€ 50.000); Gruppo di sostegno FFC Ricerca di Ghedi (€ 40.000); Gruppo di sostegno FFC Ricerca “Il Sogno di Aiden” (€ 40.000); Amici della Ritty (€ 40.000).',
    ],
  },
  'FFC#5/2023': {
    title: 'FFC#5/2023 - Oltre il polmone: studiare il ruolo dell’intestino nella fibrosi cistica',
    body: [
      'Responsabile: Alessandra Bragonzi (Unità Infezioni e Fibrosi cistica, Divisione di Immunologia, Trapianti e Malattie Infettive, Istituto Scientifico San Raffaele, Milano).',
      'Finanziamento: 136.500 €.',
      'Adottato totalmente da: Delegazione FFC Ricerca di Palermo e Trapani - #8maggioèpersempre2023 in memoria di Costanza (8.000€).',
    ],
  },
}
