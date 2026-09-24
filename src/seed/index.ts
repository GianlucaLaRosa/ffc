import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { COUNTRIES } from './data/countries'
import { ITALIAN_REGIONS } from './data/regions'
import { createLexicalDoc } from './lexicalHelpers'

async function runSeed() {
  console.log('🌱 Starting FCC Conference database seed...')
  const payload = await getPayload({ config: configPromise })

  // 1. Seed Admin User
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existingUsers.totalDocs === 0) {
    console.log('👤 Creating default admin user (admin@fcc-conference.org)...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@fcc-conference.org',
        password: 'Password123!',
      },
    })
    console.log('✅ Admin user created: admin@fcc-conference.org / Password123!')
  }

  // 2. Seed Countries
  const existingCountries = await payload.find({
    collection: 'countries',
    limit: 1,
  })

  let countryMap = new Map<string, any>()
  if (existingCountries.totalDocs === 0) {
    console.log(`🌍 Seeding ${COUNTRIES.length} countries...`)
    for (const c of COUNTRIES) {
      const created = await payload.create({
        collection: 'countries',
        data: c,
      })
      countryMap.set(c.name, created)
    }
    console.log('✅ Countries seeded successfully.')
  } else {
    const all = await payload.find({ collection: 'countries', limit: 300 })
    for (const c of all.docs) {
      countryMap.set(c.name, c)
    }
  }

  // 3. Seed Italian Regions
  const existingRegions = await payload.find({
    collection: 'italian-regions',
    limit: 1,
  })

  let regionMap = new Map<string, any>()
  if (existingRegions.totalDocs === 0) {
    console.log(`🇮🇹 Seeding ${ITALIAN_REGIONS.length} Italian regions...`)
    for (const r of ITALIAN_REGIONS) {
      const created = await payload.create({
        collection: 'italian-regions',
        data: { name: r },
      })
      regionMap.set(r, created)
    }
    console.log('✅ Italian regions seeded.')
  } else {
    const all = await payload.find({ collection: 'italian-regions', limit: 50 })
    for (const r of all.docs) {
      regionMap.set(r.name, r)
    }
  }

  // 4. Seed Abstract Statuses
  const statusSlugs = [
    { name: 'New', slug: 'new', color: '#3b82f6', order: 1 },
    { name: 'Ongoing', slug: 'ongoing', color: '#f59e0b', order: 2 },
    { name: 'Concluded', slug: 'concluded', color: '#10b981', order: 3 },
  ]

  let statusMap = new Map<string, any>()
  for (const s of statusSlugs) {
    const existing = await payload.find({
      collection: 'abstract-statuses',
      where: { slug: { equals: s.slug } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'abstract-statuses',
        data: s,
      })
      statusMap.set(s.slug, created)
    } else {
      const updated = await payload.update({
        collection: 'abstract-statuses',
        id: existing.docs[0].id,
        data: {
          order: s.order,
          color: s.color,
        },
      })
      statusMap.set(s.slug, updated)
    }
  }
  console.log('✅ Abstract statuses ready: new, ongoing, concluded.')

  // 5. Seed Institutions
  const italyDoc = countryMap.get('Italy') || (await payload.find({ collection: 'countries', limit: 1 })).docs[0]
  const denmarkDoc = countryMap.get('Denmark') || italyDoc
  const venetoDoc = regionMap.get('Veneto')
  const lazioDoc = regionMap.get('Lazio')
  const lombardiaDoc = regionMap.get('Lombardia')

  const institutionsData = [
    {
      name: 'Cystic Fibrosis Center, Verona University Hospital',
      country: italyDoc.id,
      region: venetoDoc?.id,
    },
    {
      name: 'Department of Pediatric Pulmonology, Bambino Gesù Children’s Hospital',
      country: italyDoc.id,
      region: lazioDoc?.id,
    },
    {
      name: 'San Raffaele Scientific Institute - Center for Genomics',
      country: italyDoc.id,
      region: lombardiaDoc?.id,
    },
    {
      name: 'Department of Biomedical Sciences, University of Milan',
      country: italyDoc.id,
      region: lombardiaDoc?.id,
    },
    {
      name: 'European Cystic Fibrosis Society (ECFS)',
      country: denmarkDoc.id,
    },
  ]

  let institutionDocs: any[] = []
  for (const inst of institutionsData) {
    const existing = await payload.find({
      collection: 'institutions',
      where: { name: { equals: inst.name } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'institutions',
        data: inst,
      })
      institutionDocs.push(created)
    } else {
      institutionDocs.push(existing.docs[0])
    }
  }
  console.log(`✅ Institutions ready (${institutionDocs.length}).`)

  // 6. Seed People (Researchers / Speakers)
  const peopleData = [
    {
      firstName: 'Marco',
      lastName: 'Rossi',
      institution: institutionDocs[0]?.id,
      bio: createLexicalDoc([
        'Prof. Marco Rossi is Director of the Cystic Fibrosis Research Unit at Verona University Hospital and member of the National Scientific Committee.',
      ]),
    },
    {
      firstName: 'Elena',
      lastName: 'Bianchi',
      institution: institutionDocs[1]?.id,
      bio: createLexicalDoc([
        'Dr. Elena Bianchi leads the Translational Pulmonology Laboratory at Bambino Gesù Hospital, focusing on CFTR modulator pharmacodynamics.',
      ]),
    },
    {
      firstName: 'Luca',
      lastName: 'Verdi',
      institution: institutionDocs[2]?.id,
      bio: createLexicalDoc([
        'Dr. Luca Verdi is Senior Research Fellow in Microbial Genomics at San Raffaele Scientific Institute, studying chronic airway biofilms.',
      ]),
    },
    {
      firstName: 'Sofia',
      lastName: 'Ricci',
      institution: institutionDocs[3]?.id,
      bio: createLexicalDoc([
        'Prof. Sofia Ricci is Chair of Molecular Genetics at the University of Milan and lead investigator for the European Horizon CF Initiative.',
      ]),
    },
    {
      firstName: 'David',
      lastName: 'Smith',
      institution: institutionDocs[4]?.id,
      bio: createLexicalDoc([
        'Dr. David Smith is Coordinator of Clinical Standards for the European Cystic Fibrosis Society, Copenhagen.',
      ]),
    },
  ]

  let peopleDocs: any[] = []
  for (const p of peopleData) {
    const existing = await payload.find({
      collection: 'people',
      where: {
        and: [{ firstName: { equals: p.firstName } }, { lastName: { equals: p.lastName } }],
      },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'people',
        data: p,
      })
      peopleDocs.push(created)
    } else {
      peopleDocs.push(existing.docs[0])
    }
  }
  console.log(`✅ People ready (${peopleDocs.length}).`)

  // 7. Abstract Content Sections & Abstracts Seeding
  const abstractsToSeed = [
    {
      code: 'CF-2026-PL01',
      title: createLexicalDoc([
        [
          { text: 'Next-Generation ' },
          { text: 'CFTR Modulators', bold: true },
          { text: ' and Personalized Rescue in ' },
          { text: 'Rare Genotypes', italic: true },
        ],
      ]),
      status: statusMap.get('ongoing')?.id,
      authors: [peopleDocs[0].id, peopleDocs[1].id, peopleDocs[3].id],
      speakers: [peopleDocs[0].id, peopleDocs[1].id],
      mainSpeakers: [
        { speaker: peopleDocs[0].id, isMain: true },
        { speaker: peopleDocs[1].id, isMain: false },
      ],
      content: [
        {
          title: 'Background & Therapeutic Rationale',
          description: createLexicalDoc([
            'Cystic fibrosis (CF) is caused by mutations in the CFTR gene leading to impaired epithelial ion transport.',
            'While small-molecule modulators have revolutionized care for patients with F508del mutations, unmet medical needs persist for rare non-responsive genotypes.',
          ]),
        },
        {
          title: 'Methods & Experimental Design',
          description: createLexicalDoc([
            'Primary human nasal and bronchial epithelial cultures were obtained from consented patients and cultured at the air-liquid interface (ALI).',
            'Transepithelial electrical resistance (TEER) and equivalent short-circuit current (Ieq) were monitored before and after sequential addition of novel candidate molecules.',
          ]),
        },
        {
          title: 'Results & Clinical Biomarkers',
          description: createLexicalDoc([
            'Candidate compound FCC-2026 restored CFTR-mediated chloride transport to 48% of wild-type levels in cell lines bearing class I and II stop mutations.',
            'No cellular toxicity was observed at effective concentrations up to 50 μM in primary organoids over 14 days of sustained exposure.',
          ]),
        },
        {
          title: 'Conclusions & Next Steps',
          description: createLexicalDoc([
            'Dual-action combinatorial regimens show synergistic restoration of airway surface liquid depth and mucociliary clearance in vitro.',
            'Phase 1 clinical evaluation protocol is under review by regulatory authorities for initiation in Q1 2027.',
          ]),
        },
      ],
    },
    {
      code: 'CF-2026-OR04',
      title: createLexicalDoc([
        [
          { text: 'Nanocarrier Delivery Overcomes ' },
          { text: 'P. aeruginosa', italic: true },
          { text: ' Biofilm Barriers in Airway Mucus', bold: true },
        ],
      ]),
      status: statusMap.get('concluded')?.id,
      authors: [peopleDocs[2].id, peopleDocs[4].id],
      speakers: [peopleDocs[2].id],
      mainSpeakers: [{ speaker: peopleDocs[2].id, isMain: true }],
      content: [
        {
          title: 'Biofilm Dynamics & Antibiotic Synergy',
          description: createLexicalDoc([
            'Investigation of polymicrobial biofilm architectures established by Pseudomonas aeruginosa and Staphylococcus aureus in hypoxic artificial mucus.',
            'Novel delivery nanoparticles demonstrated 5-fold penetration increase through exopolysaccharide matrix.',
          ]),
        },
        {
          title: 'Conclusions & Clinical Translation',
          description: createLexicalDoc([
            'Targeted nanocarriers effectively disruption mucus-embedded bacterial colonies at one-fourth the standard tobramycin dosage.',
            'In vivo validation demonstrates reduced lung inflammation and improved bacterial clearance kinetics in preclinical models.',
          ]),
        },
      ],
    },
    {
      code: 'CF-2026-CT02',
      title: createLexicalDoc([
        [
          { text: 'Clinical Trials Update: Phase 2 Evaluation of ' },
          { text: 'Stop-Codon Readthrough', bold: true },
          { text: ' Agents in ' },
          { text: 'Nonsense CFTR Mutations', italic: true },
        ],
      ]),
      status: statusMap.get('ongoing')?.id,
      authors: [peopleDocs[3].id, peopleDocs[0].id, peopleDocs[4].id],
      speakers: [peopleDocs[3].id],
      mainSpeakers: [{ speaker: peopleDocs[3].id, isMain: true }],
      content: [
        {
          title: 'Background & Trial Rationale',
          description: createLexicalDoc([
            'Premature termination codons (PTCs) account for approximately 11% of CF alleles worldwide and are refractory to current CFTR potentiators and correctors.',
            'Novel translational readthrough-inducing molecules promote ribosomal bypassing of stop codons, enabling full-length functional protein synthesis.',
          ]),
        },
        {
          title: 'Study Design & Cohort Characteristics',
          description: createLexicalDoc([
            'Multicenter double-blind crossover study involving 48 adult CF patients harboring at least one nonsense allele (W1282X, G542X, or R553X).',
            'Primary outcome measures included safety, sweat chloride concentration change, and spirometric markers (FEV1%) over a 16-week period.',
          ]),
        },
        {
          title: 'Interim Results & Sweat Chloride Kinetics',
          description: createLexicalDoc([
            'A statistically significant mean reduction in sweat chloride of -17.2 mmol/L (p < 0.005) was documented in patients receiving active therapy.',
            'Improvements correlated with detectable CFTR apical immunostaining in nasal brushings obtained at week 8.',
          ]),
        },
        {
          title: 'Conclusions & Outlook',
          description: createLexicalDoc([
            'Translational readthrough therapy represents a viable pathway toward universal therapeutic access for patients with refractory premature stop codons.',
            'Pivotal Phase 3 international trial protocols are being finalized for submission.',
          ]),
        },
      ],
    },
    {
      code: 'CF-2026-PL02',
      title: createLexicalDoc([
        [
          { text: 'In Vivo mRNA & ' },
          { text: 'Genetic Delivery Vehicles', bold: true },
          { text: ': Targeted Nanomedicine for Respiratory Epithelia', italic: true },
        ],
      ]),
      status: statusMap.get('new')?.id,
      authors: [peopleDocs[4].id, peopleDocs[1].id, peopleDocs[2].id],
      speakers: [peopleDocs[4].id, peopleDocs[1].id],
      mainSpeakers: [
        { speaker: peopleDocs[4].id, isMain: true },
        { speaker: peopleDocs[1].id, isMain: false },
      ],
      content: [
        {
          title: 'Background & Physiological Barriers',
          description: createLexicalDoc([
            'Non-viral nucleic acid delivery to the cystic fibrosis airway must overcome both dense viscoelastic mucus barriers and tight apical epithelial junctions.',
            'Engineered lipid nanoparticles (LNPs) offer potential for repeatable, non-immunogenic pulmonary aerosolization.',
          ]),
        },
        {
          title: 'Nanoparticle Formulation & In Vitro Transfection',
          description: createLexicalDoc([
            'Optimized ionizable lipid libraries were screened using high-throughput microfluidics to formulate CFTR-mRNA encapsulating nanoparticles.',
            'Formulations showed 78% cellular uptake in well-differentiated human primary airway epithelial cultures with negligible cytotoxicity.',
          ]),
        },
        {
          title: 'Electrophysiological Rescue',
          description: createLexicalDoc([
            'Ussing chamber recordings confirmed restoration of cyclic-AMP stimulated transepithelial chloride transport to 52% of wild-type control levels.',
            'Protein stability persisted through 72 hours post-single nebulization in vitro.',
          ]),
        },
        {
          title: 'Conclusions & Translation',
          description: createLexicalDoc([
            'Inhaled mRNA-LNP platforms provide a genotype-agnostic therapeutic route that could ultimately cure CF respiratory manifestations regardless of mutation class.',
          ]),
        },
      ],
    },
    {
      code: 'CF-2026-OR08',
      title: createLexicalDoc([
        [
          { text: 'Digital Health Biomarkers and ' },
          { text: 'Home Spirometry', bold: true },
          { text: ' in Assessing Long-Term Multidisciplinary Outcomes' },
        ],
      ]),
      status: statusMap.get('new')?.id,
      authors: [peopleDocs[1].id, peopleDocs[3].id, peopleDocs[0].id],
      speakers: [peopleDocs[1].id],
      mainSpeakers: [{ speaker: peopleDocs[1].id, isMain: true }],
      content: [
        {
          title: 'Introduction & Telemedicine Landscape',
          description: createLexicalDoc([
            'The integration of connected spirometers, pulse oximeters, and patient-reported digital symptom diaries has transformed CF follow-up care.',
            'Machine learning predictive modeling allows real-time forecasting of acute pulmonary exacerbations.',
          ]),
        },
        {
          title: 'Cohort & Data Modeling',
          description: createLexicalDoc([
            'Prospective 24-month longitudinal cohort of 135 pediatric and adult CF individuals transmitting daily digital biometric tele-readings.',
            'Random forest models trained on diurnal FEV1 oscillations and cough patterns were evaluated against clinical diagnosis benchmarks.',
          ]),
        },
        {
          title: 'Clinical Outcomes & Exacerbation Prevention',
          description: createLexicalDoc([
            'The algorithm predicted pulmonary exacerbation onset an average of 4.8 days prior to emergency presentations (AUC: 0.89).',
            'Early remote intervention resulted in a 36% reduction in intravenous antibiotic days across the study period.',
          ]),
        },
        {
          title: 'Conclusions',
          description: createLexicalDoc([
            'Digital home monitoring combined with proactive clinical alerts significantly preserves lung function and enhances multidisciplinary care coordination.',
          ]),
        },
      ],
    },
  ]

  // 8. Upsert Abstracts (ensuring embedded content sections)
  let abstractMap = new Map<string, any>()
  for (const a of abstractsToSeed) {
    const existing = await payload.find({
      collection: 'abstracts',
      where: { code: { equals: a.code } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'abstracts',
        data: a,
      })
      abstractMap.set(a.code, created)
    } else {
      const updated = await payload.update({
        collection: 'abstracts',
        id: existing.docs[0].id,
        data: a,
      })
      abstractMap.set(a.code, updated)
    }
  }
  console.log(`✅ Abstracts ready (${abstractMap.size}) with embedded content sections.`)

  // 9. Seed Days
  let dayDocs: any[] = []
  const existingDays = await payload.find({
    collection: 'days',
    limit: 2,
  })

  if (existingDays.totalDocs === 0) {
    const d1 = await payload.create({
      collection: 'days',
      data: {
        title: 'Day 1 - Thursday, 22 Oct 2026',
        date: '2026-10-22T08:00:00.000Z',
        order: 1,
      },
    })
    const d2 = await payload.create({
      collection: 'days',
      data: {
        title: 'Day 2 - Friday, 23 Oct 2026',
        date: '2026-10-23T08:00:00.000Z',
        order: 2,
      },
    })
    dayDocs = [d1, d2]
    console.log('✅ Conference Days created.')
  } else {
    dayDocs = existingDays.docs
  }

  // 10. Seed Agenda Items & Link to Abstracts
  const existingAgenda = await payload.find({
    collection: 'agenda-items',
    limit: 1,
  })

  if (existingAgenda.totalDocs === 0) {
    console.log('🗓️ Seeding agenda items...')

    // Sub-talks for Track
    const subTalk1 = await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Airway Microenvironment & Bacterial Clearance' }]]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T11:00:00.000Z',
        endTime: '2026-10-22T11:45:00.000Z',
        duration: '45 min',
        icon: 'dna',
        abstract: abstractMap.get('CF-2026-OR04')?.id,
        description: createLexicalDoc(['Detailed presentation on mucus rheology and biofilm clearance mechanics.']),
      },
    })

    const subTalk2 = await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Clinical Trials Update: Stop-Codon Readthrough' }]]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T11:45:00.000Z',
        endTime: '2026-10-22T12:30:00.000Z',
        duration: '45 min',
        icon: 'stethoscope',
        abstract: abstractMap.get('CF-2026-CT02')?.id,
        description: createLexicalDoc(['Overview of international multicenter trial cohorts and safety endpoints.']),
      },
    })

    // Day 1 Agenda Items
    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Delegate Registration & Welcome Coffee' }]]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T08:30:00.000Z',
        endTime: '2026-10-22T09:15:00.000Z',
        duration: '45 min',
        icon: 'coffee',
        description: createLexicalDoc(['Badge collection, registration desk, and networking espresso break.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([
          [
            { text: 'Plenary Keynote: ' },
            { text: 'Next-Generation CFTR Modulators & Gene Therapy Horizons', bold: true },
          ],
        ]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T09:15:00.000Z',
        endTime: '2026-10-22T10:30:00.000Z',
        duration: '1h 15m',
        isKeynote: true,
        icon: 'presentation',
        abstract: abstractMap.get('CF-2026-PL01')?.id,
        description: createLexicalDoc(['Opening keynote reviewing milestones and future roadmap in CF curative medicine.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Parallel Symposium: Translational & Clinical Sciences', bold: true }]]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T11:00:00.000Z',
        endTime: '2026-10-22T12:30:00.000Z',
        duration: '1h 30m',
        icon: 'flask-conical',
        children: [subTalk1.id, subTalk2.id],
        description: createLexicalDoc(['Symposium featuring targeted parallel scientific oral communications.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Networking Buffet Lunch & Moderated Poster Walk' }]]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T12:30:00.000Z',
        endTime: '2026-10-22T14:00:00.000Z',
        duration: '1h 30m',
        icon: 'utensils',
        description: createLexicalDoc(['Buffet lunch served in the cloisters. Poster presenters will be available at exhibition panels.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([
          [{ text: 'Scientific Session II: Pulmonary Infection & Host-Pathogen Dynamics' }],
        ]),
        day: dayDocs[0].id,
        startTime: '2026-10-22T14:00:00.000Z',
        endTime: '2026-10-22T16:00:00.000Z',
        duration: '2h',
        icon: 'mic',
        abstract: abstractMap.get('CF-2026-OR04')?.id,
        description: createLexicalDoc(['Selected short oral communications from abstract reviewers.']),
      },
    })

    // Day 2 Agenda Items
    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([
          [
            { text: 'Plenary Keynote: ' },
            { text: 'In Vivo RNA & Genetic Delivery Vehicles in Epithelial Cells', bold: true },
          ],
        ]),
        day: dayDocs[1].id,
        startTime: '2026-10-23T09:00:00.000Z',
        endTime: '2026-10-23T10:15:00.000Z',
        duration: '1h 15m',
        isKeynote: true,
        icon: 'presentation',
        abstract: abstractMap.get('CF-2026-PL02')?.id,
        description: createLexicalDoc(['Frontier technologies in nucleic acid delivery systems and lipid nanoparticles.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([
          [{ text: 'Roundtable: Multidisciplinary Patient Care & Long-Term Outcomes' }],
        ]),
        day: dayDocs[1].id,
        startTime: '2026-10-23T10:45:00.000Z',
        endTime: '2026-10-23T12:30:00.000Z',
        duration: '1h 45m',
        icon: 'message-square',
        abstract: abstractMap.get('CF-2026-OR08')?.id,
        description: createLexicalDoc(['Panel discussion bringing together clinicians, nurses, physiotherapists, and patient advocates.']),
      },
    })

    await payload.create({
      collection: 'agenda-items',
      data: {
        title: createLexicalDoc([[{ text: 'Closing Ceremony & Young Investigator Awards' }]]),
        day: dayDocs[1].id,
        startTime: '2026-10-23T12:30:00.000Z',
        endTime: '2026-10-23T13:30:00.000Z',
        duration: '1h',
        icon: 'award',
        description: createLexicalDoc(['Presentation of the best scientific contributions and formal conference adjournment.']),
      },
    })
    console.log('✅ Agenda items created with linked abstracts.')
  } else {
    // Update existing agenda items to link the new abstracts
    const allAgenda = await payload.find({
      collection: 'agenda-items',
      limit: 50,
    })

    const linksByStartTime: Record<string, any> = {
      '2026-10-22T09:15:00.000Z': abstractMap.get('CF-2026-PL01')?.id,
      '2026-10-22T11:00:00.000Z': abstractMap.get('CF-2026-OR04')?.id,
      '2026-10-22T11:45:00.000Z': abstractMap.get('CF-2026-CT02')?.id,
      '2026-10-22T14:00:00.000Z': abstractMap.get('CF-2026-OR04')?.id,
      '2026-10-23T09:00:00.000Z': abstractMap.get('CF-2026-PL02')?.id,
      '2026-10-23T10:45:00.000Z': abstractMap.get('CF-2026-OR08')?.id,
    }

    for (const item of allAgenda.docs) {
      if (item.startTime && linksByStartTime[item.startTime]) {
        await payload.update({
          collection: 'agenda-items',
          id: item.id,
          data: {
            abstract: linksByStartTime[item.startTime],
          },
        })
      }
    }
    console.log('✅ Existing agenda items updated with linked abstracts.')
  }

  // 11. Seed Conference
  const existingConferences = await payload.find({
    collection: 'conferences',
    limit: 1,
  })

  let confDoc: any
  if (existingConferences.totalDocs === 0) {
    console.log('🏛️ Seeding conference edition...')
    confDoc = await payload.create({
      collection: 'conferences',
      data: {
        editionName: createLexicalDoc([
          [
            { text: '24th National ' },
            { text: 'Cystic Fibrosis', bold: true },
            { text: ' Research Conference 2026' },
          ],
        ]),
        editionYear: 2026,
        primaryColor: '#0d5c3a',
        accentColor: '#2ecc71',
        startDate: '2026-10-22T08:30:00.000Z',
        endDate: '2026-10-23T14:30:00.000Z',
        city: 'Verona',
        country: 'Italy',
        street: 'Piazza Bra 1 - Palazzo della Gran Guardia',
        locationCoords: {
          latitude: 45.4384,
          longitude: 10.9916,
        },
        days: dayDocs.map((d) => d.id),
        generalDescription: createLexicalDoc([
          'The Annual Scientific Conference brings together over 400 researchers, clinicians, and patient delegates dedicated to defeating Cystic Fibrosis.',
          'Over two days of rigorous scientific exchange, leading European laboratories present cutting-edge discoveries spanning molecular biology, translational genetics, microbiology, and clinical care standards.',
        ]),
        location: createLexicalDoc([
          'Palazzo della Gran Guardia is located in the historical center of Verona, overlooking the world-renowned Roman Arena in Piazza Bra.',
          'Transit: Only 12 minutes on foot from Verona Porta Nuova Central Railway Station. Regular direct shuttle bus connections from Verona Valerio Catullo Airport (VRN) and Milan Bergamo (BGY).',
        ]),
      },
    })
    console.log('✅ Conference created.')
  } else {
    confDoc = existingConferences.docs[0]
  }

  // 12. Update Global Site Settings
  console.log('⚙️ Updating global site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      activeConference: confDoc.id,
    },
  })
  console.log('✅ Global site settings updated with active conference.')

  console.log('🎉 Seed completed successfully!')
  process.exit(0)
}

runSeed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
