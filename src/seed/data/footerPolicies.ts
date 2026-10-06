import {
  createLexicalDoc,
  createLexicalHeading,
  createLexicalList,
  createLexicalParagraph,
  createLexicalQuote,
  createLexicalRoot,
} from '../lexicalHelpers'

const cookieLink = {
  type: 'link' as const,
  url: '/cookie-policy',
  text: 'Cookie Policy',
}

const privacyLink = {
  type: 'link' as const,
  url: '/privacy',
  text: 'Privacy Policy',
}

const foundationSite = {
  type: 'link' as const,
  url: 'https://www.fibrosicisticaricerca.it',
  text: 'www.fibrosicisticaricerca.it',
  newTab: true,
}

const garanteSite = {
  type: 'link' as const,
  url: 'https://www.garanteprivacy.it',
  text: 'www.garanteprivacy.it',
  newTab: true,
}

export const COOKIE_POLICY_SEED = {
  title: 'Cookie Policy',
  kicker: 'Official Policy & Compliance Statement',
  headerBadge: 'Technical Storage Only',
  lastUpdated: 'October 2026',
  metaDescription:
    'Information regarding cookies, local storage, and tracking technologies on the official FFC Scientific Conference website.',
  intro: createLexicalDoc([
    [
      'Official statement on cookies and similar technologies for the ',
      { text: 'FFC Scientific Conference', bold: true },
      ' website, managed by ',
      { text: 'Fondazione Ricerca Fibrosi Cistica - ETS', bold: true },
      '.',
    ],
  ]),
  summaryTitle: 'Summary: strictly necessary technical storage only',
  summary: createLexicalDoc([
    [
      'We believe in privacy-by-design. This website is built as an open, accessible scientific portal for researchers, clinicians, and participants. We do ',
      { text: 'not', bold: true },
      ' profile your browsing behavior, we do ',
      { text: 'not', bold: true },
      ' use analytics or advertising cookies, and we do ',
      { text: 'not', bold: true },
      ' integrate third-party tracking networks. Only strictly necessary technical storage is used to run the site and optional programme features you choose.',
    ],
  ]),
  highlights: [
    { label: 'No Profiling Cookies' },
    { label: 'No Third-Party Trackers' },
    { label: 'Technical Storage Only' },
  ],
  content: createLexicalRoot([
    createLexicalHeading('h3', '01. What Are Cookies?'),
    createLexicalParagraph(
      'Cookies are small text files that websites often store on a visitor’s computer or mobile device when visiting a webpage. They are widely used to make websites work efficiently, remember user preferences, monitor visitor analytics, or deliver targeted advertising.',
    ),
    createLexicalHeading('h3', '02. What We Use on the Public Website'),
    createLexicalParagraph([
      'On this public website (the conference presentation, programme schedule, scientific abstracts, and venue directions), we use ',
      { text: 'only strictly necessary technical storage', bold: true },
      '. We do ',
      { text: 'not', bold: true },
      ' set profiling, marketing, analytics, or third-party tracking cookies:',
    ]),
    createLexicalList([
      [
        { text: 'No Profiling Cookies: ', bold: true },
        'We do not track or build behavioral profiles of users visiting this site.',
      ],
      [
        { text: 'No Marketing or Advertising Cookies: ', bold: true },
        'We do not display commercial ads and do not share data with ad-tech brokers or marketing platforms.',
      ],
      [
        { text: 'No Third-Party Analytics Cookies: ', bold: true },
        'We do not deploy invasive third-party analytics cookies (such as Google Analytics with cross-site tracking).',
      ],
      [
        { text: 'No Social Network Widgets or Beacons: ', bold: true },
        'We do not embed active social media scripts (such as Meta Pixel or LinkedIn Insight Tag) that transmit user telemetry to third parties.',
      ],
    ]),
    createLexicalHeading('h3', '03. Strictly Necessary Local Storage'),
    createLexicalParagraph(
      'Some features store data locally in your browser instead of using HTTP cookies. This data stays on your device and is not sold or shared with advertisers:',
    ),
    createLexicalList([
      [
        { text: 'My programme: ', bold: true },
        'saved talks or abstracts and your alert preferences (local storage).',
      ],
      [
        { text: 'Theme: ', bold: true },
        'light, dark, or system appearance (local storage).',
      ],
      [
        { text: 'Dismissed notices: ', bold: true },
        'which conference notices you closed during the current browser session (session storage).',
      ],
      [
        { text: 'Cookie notice: ', bold: true },
        'whether you acknowledged this policy (local storage).',
      ],
      [
        { text: 'Installable app / alerts (optional): ', bold: true },
        'a service worker and, only if you explicitly enable alerts, a push subscription managed by your browser permission prompt.',
      ],
    ]),
    createLexicalHeading('h3', '04. Cookie Notice'),
    createLexicalQuote([
      'Under the ',
      { text: 'EU ePrivacy Directive (Directive 2002/58/EC)', bold: true },
      ', the ',
      { text: 'General Data Protection Regulation (GDPR - Regulation EU 2016/679)', bold: true },
      ', and the ',
      { text: 'Guidelines on Cookies and other Tracking Tools', bold: true },
      ' issued by the Italian Data Protection Authority (',
      { text: 'Garante per la protezione dei dati personali', italic: true },
      ', June 10, 2021), consent is ',
      { text: 'not required', bold: true },
      ' for strictly necessary technical cookies and similar storage. We still show a short notice on first visit so you can read this policy and confirm before we remember your choice.',
    ]),
    createLexicalHeading('h3', '05. Technical Server Logs'),
    createLexicalParagraph(
      'Like virtually all web servers, the hosting infrastructure automatically records standard technical connection logs (such as your IP address, browser type and version, operating system, requested URL, and timestamp of the request).',
    ),
    createLexicalParagraph([
      'These technical logs are strictly processed for network security purposes (such as detecting and mitigating cyber-attacks or DDoS attempts) and guaranteeing the operational stability of the server. They are not used to identify visitors, are not matched with third-party databases, and are automatically purged in accordance with standard data retention schedules. For more details, please refer to our ',
      privacyLink,
      '.',
    ]),
    createLexicalHeading('h3', '06. Staff authentication'),
    createLexicalParagraph(
      'Authenticated conference staff receive a strictly technical session cookie needed to stay signed in to the editorial area. Regular public visitors browsing the conference website do not receive this token.',
    ),
    createLexicalHeading('h3', '07. Data Controller & Inquiries'),
    createLexicalParagraph([
      { text: 'Fondazione Ricerca Fibrosi Cistica - ETS (FFC Ricerca)', bold: true },
    ]),
    createLexicalParagraph(
      'Piazza Bra 1 - Palazzo della Gran Guardia / Scientific Secretariat',
    ),
    createLexicalParagraph('Verona (VR), Italy'),
    createLexicalParagraph([
      'For questions regarding this policy or the processing of personal data, please contact the scientific secretariat or visit the official foundation portal at ',
      foundationSite,
      '.',
    ]),
  ]),
}

export const PRIVACY_POLICY_SEED = {
  title: 'Privacy Policy',
  kicker: 'Articles 13 & 14 - Regulation (EU) 2016/679 (GDPR)',
  headerBadge: 'GDPR Compliant',
  lastUpdated: 'October 2026',
  metaDescription:
    'Information on personal data processing for the official FFC Scientific Conference website in compliance with GDPR.',
  intro: createLexicalDoc([
    [
      'This notice describes how personal data is processed when visiting the official conference platform of the ',
      { text: 'FFC Scientific Conference', bold: true },
      ', operated by ',
      { text: 'Fondazione Ricerca Fibrosi Cistica - ETS', bold: true },
      '.',
    ],
  ]),
  controllerName: 'Fondazione Ricerca Fibrosi Cistica - ETS (FFC Ricerca)',
  controllerAddress: 'Piazza Bra 1 - Palazzo della Gran Guardia\nVerona (VR), Italy',
  controllerWebsite: 'https://www.fibrosicisticaricerca.it',
  content: createLexicalRoot([
    createLexicalHeading('h3', '02. Categories of Personal Data Collected'),
    createLexicalHeading('h4', 'A. Technical Browsing Data (Log Files)'),
    createLexicalParagraph(
      'During normal operation, the software procedures and IT infrastructure providing this website automatically acquire specific data whose transmission is implicit in the use of Internet communication protocols (e.g., IP addresses, device operating system, browser user-agent, requested URI addresses, time of request, HTTP status code returned by the server). This data is processed strictly for technical diagnostics, cyber-security, and system stability.',
    ),
    createLexicalHeading('h4', 'B. Conference Scientific Directory'),
    createLexicalParagraph(
      'Names, institutional affiliations, and scientific biographies of speakers, session moderators, and abstract contributors displayed on this website are published solely for academic and scientific dissemination purposes in connection with the conference proceedings.',
    ),
    createLexicalHeading('h4', 'C. Cookies and Trackers'),
    createLexicalParagraph([
      'The public website does ',
      { text: 'not', bold: true },
      ' use profiling, analytics, advertising, or third-party tracking tools. It uses only strictly necessary technical storage (such as local storage for My programme and theme, session storage for dismissed notices, and an optional service worker if you enable alerts). For complete details, consult our dedicated ',
      cookieLink,
      '.',
    ]),
    createLexicalHeading('h3', '03. Legal Basis and Purpose of Processing'),
    createLexicalList([
      [
        { text: 'Operational Delivery & Security: ', bold: true },
        'Processing technical connection data is necessary for the legitimate interest of the Data Controller to ensure network security, prevent cyber attacks, and maintain web platform availability (Art. 6(1)(f) GDPR).',
      ],
      [
        { text: 'Scientific Communication: ', bold: true },
        'Presentation of conference programmes, abstracts, and speaker credentials serves the legitimate statutory interest of the Foundation in fostering non-profit medical and scientific research (Art. 6(1)(f) GDPR).',
      ],
    ]),
    createLexicalHeading('h3', '04. Data Retention Periods'),
    createLexicalParagraph(
      'Technical server connection logs are retained for no longer than necessary to verify server integrity and security incidents (typically up to 30 days), after which they are deleted or irreversibly anonymized. Scientific conference schedules and abstract archives remain accessible for historical reference and scientific documentation.',
    ),
  ]),
  rightsHeading: '05. Your Rights Under GDPR (Articles 15-22)',
  rightsIntro: createLexicalDoc([
    'As an interested data subject, you have the right to exercise at any time the rights guaranteed under Chapter III of the GDPR:',
  ]),
  rights: [
    {
      title: 'Right of Access (Art. 15)',
      description: 'Confirm whether your data is being processed and obtain copies.',
    },
    {
      title: 'Right to Rectification (Art. 16)',
      description: 'Request correction of inaccurate or incomplete information.',
    },
    {
      title: 'Right to Erasure (Art. 17)',
      description: 'Request deletion of data where legal grounds apply.',
    },
    {
      title: 'Right to Object (Art. 21)',
      description: 'Object at any time to processing based on legitimate interests.',
    },
  ],
  complaintNote: createLexicalDoc([
    [
      'You also have the right to lodge a formal complaint with the supervisory authority (in Italy: ',
      { text: 'Garante per la protezione dei dati personali', italic: true },
      ', ',
      garanteSite,
      ').',
    ],
  ]),
}
