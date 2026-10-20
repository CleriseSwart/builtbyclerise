import type { Localized } from './types'

// Source: Clérise's brief (private/brief.md). Location stays "South Africa"; studies before 2015 are
// not mentioned.

export interface TimelineEntry {
  /** Display period, e.g. "2019 – 2021". Kept as text because some entries overlap. */
  period: string
  title: string
  place: string
  body: string
  /** Highlights the engineering milestones in the timeline. */
  kind: 'support' | 'engineering' | 'business' | 'study'
}

export const timeline: Localized<TimelineEntry[]> = {
  en: [
    {
      period: '2015',
      title: 'Freelance, remote',
      place: 'South Africa',
      body: 'My first remote work. I have worked from home ever since, with backup power and a proper connection.',
      kind: 'support',
    },
    {
      period: '2015 – 2019, 2022',
      title: 'Player support',
      place: '5CA',
      body: 'Support for AAA games such as Fortnite, Assassin’s Creed, NBA 2K and WWE. I wrote macros, escalation protocols and knowledge-base articles, and onboarded and trained agents.',
      kind: 'support',
    },
    {
      period: '2019',
      title: 'Started SpottedMooDigitizing',
      place: 'Etsy',
      body: 'Machine-embroidery designs, digitised stitch by stitch. My first business, and still open.',
      kind: 'business',
    },
    {
      period: '2019 – 2021',
      title: 'E-commerce Team Manager',
      place: 'Amazon',
      body: 'Led an international team of 20: KPIs, process improvements and hiring.',
      kind: 'support',
    },
    {
      period: '2021 – 2022',
      title: 'Player Account Manager',
      place: 'Officium Labs / Arise Gaming',
      body: 'Escalation lead for Game of Thrones: Conquest, and I set up the support structure for the launch of Harry Potter: Magic Awakened. Somewhere in there I realised I wanted to build the systems, not only work around them.',
      kind: 'support',
    },
    {
      period: '2022 – 2023',
      title: 'Full Stack Web Development',
      place: 'HyperionDev',
      body: 'Over 800 hours of project-based training: React, Node.js, Express, MongoDB, and some Laravel, PHP and SQL. I graduated early with a final average of 100%, first in my cohort.',
      kind: 'study',
    },
    {
      period: 'Dec 2023 – Dec 2025',
      title: 'Full Stack Developer',
      place: 'Sterrk IT Recruitment & Consultancy, Amsterdam (remote)',
      body: 'Vue 3 and TypeScript front-ends, a custom WordPress theme, and project leadership. When leadership changed hands, I wrote the documentation that carried the team through it.',
      kind: 'engineering',
    },
    {
      period: '2026',
      title: 'Rebuilt HCreations and started FEW',
      place: 'Built by Clérise',
      body: 'Replaced my own shop’s WooCommerce with Laravel and Vue, and took on FEW Cutting Tools: a website, a shop, a sales dashboard and a factory calculator.',
      kind: 'engineering',
    },
    {
      period: 'Dec 2026',
      title: 'BSc Computer Science',
      place: 'Unisa',
      body: 'Completing in December 2026, after seven years of self-study alongside work.',
      kind: 'study',
    },
  ],
  af: [
    {
      period: '2015',
      title: 'Vryskut, remote',
      place: 'Suid-Afrika',
      body: 'My eerste remote werk. Sedertdien werk ek van die huis af, met rugsteunkrag en ’n goeie verbinding.',
      kind: 'support',
    },
    {
      period: '2015 – 2019, 2022',
      title: 'Spelerondersteuning',
      place: '5CA',
      body: 'Ondersteuning vir AAA-speletjies soos Fortnite, Assassin’s Creed, NBA 2K en WWE. Ek het makros, eskalasieprotokolle en kennisbasis-artikels geskryf, en agente ingewerk en opgelei.',
      kind: 'support',
    },
    {
      period: '2019',
      title: 'SpottedMooDigitizing begin',
      place: 'Etsy',
      body: 'Masjienborduurontwerpe, steek vir steek gedigitaliseer. My eerste besigheid, en steeds oop.',
      kind: 'business',
    },
    {
      period: '2019 – 2021',
      title: 'E-commerce Team Manager',
      place: 'Amazon',
      body: '’n Internasionale span van 20 gelei: KPI’s, prosesverbeterings en aanstellings.',
      kind: 'support',
    },
    {
      period: '2021 – 2022',
      title: 'Player Account Manager',
      place: 'Officium Labs / Arise Gaming',
      body: 'Eskalasieleier vir Game of Thrones: Conquest, en ek het die ondersteuningstruktuur vir die bekendstelling van Harry Potter: Magic Awakened opgestel. Iewers daar het ek besef ek wil die stelsels bou, nie net daarom werk nie.',
      kind: 'support',
    },
    {
      period: '2022 – 2023',
      title: 'Full Stack Web Development',
      place: 'HyperionDev',
      body: 'Meer as 800 uur se projekgebaseerde opleiding: React, Node.js, Express, MongoDB, en ’n bietjie Laravel, PHP en SQL. Ek het vroeg gegradueer met ’n finale gemiddeld van 100%, eerste in my groep.',
      kind: 'study',
    },
    {
      period: 'Des 2023 – Des 2025',
      title: 'Full Stack Developer',
      place: 'Sterrk IT Recruitment & Consultancy, Amsterdam (remote)',
      body: 'Vue 3- en TypeScript-front-ends, ’n pasgemaakte WordPress-tema, en projekleiding. Toe die leierskap oorgehandig is, het ek die dokumentasie geskryf wat die span daardeur gedra het.',
      kind: 'engineering',
    },
    {
      period: '2026',
      title: 'HCreations herbou en FEW begin',
      place: 'Built by Clérise',
      body: 'My eie winkel se WooCommerce met Laravel en Vue vervang, en FEW Cutting Tools aangepak: ’n webwerf, ’n winkel, ’n verkoopspaneel en ’n fabriek-sakrekenaar.',
      kind: 'engineering',
    },
    {
      period: 'Des 2026',
      title: 'BSc Rekenaarwetenskap',
      place: 'Unisa',
      body: 'Voltooi in Desember 2026, ná sewe jaar se selfstudie langs werk.',
      kind: 'study',
    },
  ],
}

export interface SkillGroup {
  level: string
  skills: string[]
}

const strong = [
  'Vue 3 (Composition API)',
  'TypeScript',
  'JavaScript',
  'HTML & CSS',
  'Pinia',
  'Vue Router',
  'Vite',
  'Tailwind CSS',
  'PrimeVue',
  'REST APIs',
  'WordPress & WooCommerce',
]
const working = [
  'Laravel / PHP',
  'PostgreSQL',
  'MySQL',
  'Node.js / Express',
  'React',
  'MongoDB',
  'Firebase',
  'Docker',
  'DigitalOcean',
  'Cloudflare',
  'Figma',
  'FlutterFlow',
]

export const skills: Localized<SkillGroup[]> = {
  en: [
    {
      level: 'Strongest',
      skills: [...strong, 'Technical documentation', 'Agile / Scrum', 'Leading teams'],
    },
    { level: 'Comfortable', skills: working },
    {
      level: 'Growing',
      skills: ['Testing (Vitest, Jest)', 'TDD', 'Eloquence BASIC (reading and porting)'],
    },
  ],
  af: [
    {
      level: 'Sterkste',
      skills: [...strong, 'Tegniese dokumentasie', 'Agile / Scrum', 'Spanne lei'],
    },
    { level: 'Gemaklik', skills: working },
    {
      level: 'Groei nog',
      skills: ['Toetsing (Vitest, Jest)', 'TDD', 'Eloquence BASIC (lees en oordra)'],
    },
  ],
}

export const tools = [
  'Git & GitHub',
  'Jira',
  'Confluence',
  'Slack',
  'Teams',
  'Google Workspace',
  'Notion',
]

export interface OtherWork {
  name: string
  body: string
}

/** Team work at Sterrk: descriptions only, no client code or internal screenshots. */
export const sterrkWork: Localized<OtherWork[]> = {
  en: [
    {
      name: 'Sterrk.nl',
      body: 'The company’s custom WordPress theme, built from scratch: pixel-perfect to the design, with performance, security and SEO.',
    },
    {
      name: 'MyParcel',
      body: 'Subcontracted front-end work on their WordPress plugin in Vue 3 and TypeScript: REST integration, Confluence documentation, sprints, PR reviews and releases.',
    },
    {
      name: 'Maxime',
      body: 'Dynamic Vue 3 components with the Composition API and TypeScript, REST integration, performance work and documentation.',
    },
    {
      name: 'Sterrk Outreach Tool',
      body: 'The front-end of an internal tool, built in FlutterFlow.',
    },
  ],
  af: [
    {
      name: 'Sterrk.nl',
      body: 'Die maatskappy se pasgemaakte WordPress-tema, van nuuts af gebou: pixel-perfect volgens die ontwerp, met prestasie, sekuriteit en SEO.',
    },
    {
      name: 'MyParcel',
      body: 'Front-end-werk as subkontrak aan hul WordPress-plugin in Vue 3 en TypeScript: REST-integrasie, Confluence-dokumentasie, sprints, PR-reviews en releases.',
    },
    {
      name: 'Maxime',
      body: 'Dinamiese Vue 3-komponente met die Composition API en TypeScript, REST-integrasie, prestasiewerk en dokumentasie.',
    },
    {
      name: 'Sterrk Outreach Tool',
      body: 'Die front-end van ’n interne hulpmiddel, gebou in FlutterFlow.',
    },
  ],
}

/** Smaller builds and the creative side. Mention only: visitors can ask to see more. */
export const sideWork: Localized<OtherWork[]> = {
  en: [
    {
      name: '8HPsa',
      body: 'A website for a car-tuning and gearbox workshop. In progress.',
    },
    {
      name: 'Dropshipping store',
      body: 'A budget WooCommerce build for a client, with POPIA pages and training so they could run it themselves.',
    },
    {
      name: 'SpottedMooDigitizing',
      body: 'My Etsy shop since 2019: digital machine-embroidery designs.',
    },
    {
      name: 'Social media and print',
      body: 'Social media management, Facebook ads in Afrikaans designed in Canva, and print-ready business cards.',
    },
  ],
  af: [
    {
      name: '8HPsa',
      body: '’n Webwerf vir ’n motor-tuning- en ratkaswerkswinkel. Besig.',
    },
    {
      name: 'Dropshipping-winkel',
      body: '’n Begroting-WooCommerce-bou vir ’n kliënt, met POPIA-bladsye en opleiding sodat hulle dit self kan bestuur.',
    },
    {
      name: 'SpottedMooDigitizing',
      body: 'My Etsy-winkel sedert 2019: digitale masjienborduurontwerpe.',
    },
    {
      name: 'Sosiale media en drukwerk',
      body: 'Sosiale media-bestuur, Afrikaanse Facebook-advertensies ontwerp in Canva, en drukgereed besigheidskaartjies.',
    },
  ],
}

export const EMAIL = 'cleriseswart@gmail.com'
export const ETSY_URL = 'https://www.etsy.com/shop/SpottedMooDigitizing'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/cleriseswart'
export const GITHUB_URL = 'https://github.com/CleriseSwart'
