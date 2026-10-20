import type { CaseStudy, CaseStudySlug } from './types'

// Facts come from the projects' own READMEs and code (C:\FEWWebsite, C:\HCreationsWebsite) and from
// Clérise's brief. Keep it that way: no invented numbers, clients or outcomes.

const few: CaseStudy = {
  slug: 'few-cutting-tools',
  name: 'FEW Cutting Tools',
  stack: [
    'Laravel 13',
    'PostgreSQL 17',
    'Redis',
    'Sanctum',
    'Vue 3',
    'TypeScript',
    'Tailwind CSS v4',
    'Docker',
    'Cloudflare Tunnel',
  ],
  links: {
    en: [
      { href: 'https://few.co.za', label: 'few.co.za (current site)' },
      { href: 'https://few.builtbyclerise.co.za', label: 'Demo (access on request)' },
    ],
    af: [
      { href: 'https://few.co.za', label: 'few.co.za (huidige werf)' },
      { href: 'https://few.builtbyclerise.co.za', label: 'Demo (toegang op aanvraag)' },
    ],
  },
  copy: {
    en: {
      chip: 'Legacy rescue',
      tagline: 'A website, a shop, a sales dashboard and a factory calculator on one API.',
      ability: 'Ports factory programs from a dying Windows XP machine to the web, quirks and all',
      role: 'Design, build and deployment',
      status: 'In progress',
      summary:
        'French Engineering Works makes cutting tools in South Africa. I am rebuilding their web presence as one Laravel API with four Vue apps, and moving their factory calculation programs off an old Windows XP machine before it gives up.',
      sections: [
        {
          heading: 'The problem',
          paragraphs: [
            'FEW had a WordPress website, a printed catalogue, quote requests by e-mail and phone, and a set of factory calculation programs written in Eloquence BASIC. Those programs run on a single Windows XP computer. Very few people still read Eloquence, and nobody wants to find out what happens when that machine stops booting.',
          ],
        },
        {
          heading: 'What I built',
          paragraphs: [
            'One Laravel 13 API on PostgreSQL and Redis, with four Vue 3 + TypeScript single-page apps on top of it:',
          ],
          points: [
            'The website, with branches, office hours, FAQs and downloads served from the API.',
            'An online shop: the printed catalogue as data (one file per catalogue page), search by name, catalogue page or FEW code, a quote list instead of a cart, and customer accounts that show the status of each request.',
            'A sales dashboard where staff work through quote requests, edit them, and keep internal notes. Every change is kept in the request’s history with who made it and when.',
            'A staff calculator that runs the ported factory programs on the server, behind a login.',
          ],
        },
        {
          heading: 'The hard part',
          paragraphs: [
            'The calculator has to give exactly the answers the old programs give, bugs included. So I documented how Eloquence rounds and reads input before porting anything, and I port one program at a time, each with tests against the original’s output.',
            'Where the old code looks wrong, I don’t quietly fix it. Each suspicion goes on a findings list for FEW to decide, from a missing comma in a data list to a variable that is never set. The number field even accepts sums like “16 + 0.381”, because that is how the staff typed into the old program.',
          ],
        },
      ],
      notes: [
        'Six repositories: API, four frontends and devops, with one-command local setup in Docker.',
        'Separate PostgreSQL schemas per domain (content, accounts, catalog, sales, calculator).',
        'Sanctum cookie auth with separate guards for customers and staff; admin rights enforced by the API.',
        'Rate-limited public endpoints and a honeypot on the contact form.',
        'Production images behind a Cloudflare Tunnel; a push to main deploys the demo.',
      ],
    },
    af: {
      chip: 'Ou kode gered',
      tagline: "'n Webwerf, 'n winkel, 'n verkoopspaneel en 'n fabriek-sakrekenaar op een API.",
      ability:
        "Dra fabriekprogramme van 'n sterwende Windows XP-rekenaar oor na die web, eienaardighede en al",
      role: 'Ontwerp, bou en ontplooiing',
      status: 'Besig',
      summary:
        "French Engineering Works maak snygereedskap in Suid-Afrika. Ek herbou hul webteenwoordigheid as een Laravel-API met vier Vue-apps, en skuif hul fabrieksberekeninge van 'n ou Windows XP-rekenaar af voordat dit opgee.",
      sections: [
        {
          heading: 'Die probleem',
          paragraphs: [
            "FEW het 'n WordPress-webwerf gehad, 'n gedrukte katalogus, kwotasieversoeke per e-pos en telefoon, en 'n stel fabrieksberekeningsprogramme in Eloquence BASIC. Daardie programme loop op een enkele Windows XP-rekenaar. Baie min mense lees nog Eloquence, en niemand wil uitvind wat gebeur as daardie masjien eendag nie meer aanskakel nie.",
          ],
        },
        {
          heading: 'Wat ek gebou het',
          paragraphs: [
            'Een Laravel 13-API op PostgreSQL en Redis, met vier Vue 3 + TypeScript-enkelbladsy-apps daarbo:',
          ],
          points: [
            'Die webwerf, met takke, kantoorure, gereelde vrae en aflaaie wat van die API af kom.',
            "'n Aanlyn winkel: die gedrukte katalogus as data (een lêer per katalogusbladsy), soek op naam, katalogusbladsy of FEW-kode, 'n kwotasielys in plaas van 'n mandjie, en kliëntrekeninge wat die status van elke versoek wys.",
            "'n Verkoopspaneel waar personeel kwotasieversoeke hanteer, wysig en interne notas hou. Elke verandering word in die versoek se geskiedenis bewaar, met wie dit gedoen het en wanneer.",
            "'n Personeel-sakrekenaar wat die oorgedraagde fabrieksprogramme op die bediener laat loop, agter 'n aanmelding.",
          ],
        },
        {
          heading: 'Die moeilike deel',
          paragraphs: [
            "Die sakrekenaar moet presies dieselfde antwoorde gee as die ou programme, foute en al. Daarom het ek eers gedokumenteer hoe Eloquence afrond en invoer lees voordat ek enigiets oorgedra het, en ek dra een program op 'n slag oor, elkeen met toetse teen die oorspronklike se uitvoer.",
            "Waar die ou kode verkeerd lyk, maak ek dit nie stilletjies reg nie. Elke vermoede gaan op 'n bevindingelys waaroor FEW besluit, van 'n ontbrekende komma in 'n datalys tot 'n veranderlike wat nooit 'n waarde kry nie. Die getalveld aanvaar selfs somme soos “16 + 0.381”, want so het die personeel in die ou program getik.",
          ],
        },
      ],
      notes: [
        'Ses repositories: API, vier front-ends en devops, met eenopdrag-opstelling in Docker.',
        'Aparte PostgreSQL-skemas per domein (content, accounts, catalog, sales, calculator).',
        'Sanctum-koekie-aanmelding met aparte guards vir kliënte en personeel; die API dwing admin-regte af.',
        "Publieke endpoints met 'n spoedlimiet, en 'n honeypot op die kontakvorm.",
        "Produksie-images agter 'n Cloudflare Tunnel; 'n push na main ontplooi die demo.",
      ],
    },
  },
}

const embroideryBlanks: CaseStudy = {
  slug: 'embroidery-blanks',
  name: 'Embroidery Blanks',
  stack: [
    'Laravel 13',
    'PostgreSQL 17',
    'Redis',
    'Vue 3',
    'TypeScript',
    'Pinia',
    'vue-i18n',
    'Reka UI',
    'TipTap',
    'Tailwind CSS v4',
    'Docker',
  ],
  links: {
    en: [{ href: 'https://embroideryblanks.co.za', label: 'embroideryblanks.co.za' }],
    af: [{ href: 'https://embroideryblanks.co.za', label: 'embroideryblanks.co.za' }],
  },
  copy: {
    en: {
      chip: 'Own business',
      tagline: 'A webshop rebuilt around how the business actually sells: on WhatsApp.',
      ability: 'Phone-only accounts and WhatsApp order updates for customers without e-mail',
      role: 'Owner, designer and developer',
      status: 'Live',
      summary:
        'HCreations Embroidery Blanks is my own business: I supply embroidery blanks to embroiderers and resellers across South Africa. I replaced its WooCommerce shop with a Laravel API and a Vue storefront and admin built for the way we work.',
      sections: [
        {
          heading: 'The problem',
          paragraphs: [
            'WooCommerce and Elementor were built for a different business. Most of our sales happen on WhatsApp. Some customers have no e-mail address at all. Every product comes in any of our binding colours, and the binding stock is shared across all products. Deliveries go to Pudo lockers, not street addresses. Each of those meant another plugin or another workaround.',
          ],
        },
        {
          heading: 'What I built',
          paragraphs: [
            'A Laravel 13 API on PostgreSQL with a Vue 3 + TypeScript storefront and admin, in English and Afrikaans:',
          ],
          points: [
            'Accounts with just a cellphone number. Password resets for those customers go through the admin or WhatsApp.',
            'In the admin, every order can send a pre-filled WhatsApp message: order status, payment reminder or shipped. A full WhatsApp Business API integration, so WhatsApp orders land in the system too, is in progress.',
            'Checkout built around Pudo lockers, with card payments through iKhokha and EFT, both behind one payment-gateway interface.',
            'Invoices and packing slips as PDFs, and a rich-text editor for the shop’s own pages.',
            'An importer that moved products, customers, orders and settings out of WordPress and writes a report of what it did. It can run again safely.',
          ],
        },
        {
          heading: 'The hard part',
          paragraphs: [
            'This is the first system I own from the screen to the server, and I am also its main user. The trickiest pieces were the stock logic for bindings that every product shares, and fitting WhatsApp into the order flow without losing track of anything.',
            'I also simplified the business itself along the way: fewer manual steps between a WhatsApp message and a packed order.',
          ],
        },
      ],
      notes: [
        'Monorepo with the API, the SPA and Docker; one PowerShell command starts everything.',
        'en.json is the schema for translations; the build fails if Afrikaans is missing a key.',
        'Headless-browser QA scripts in Docker, and Lighthouse 90+ on mobile for the home and product pages.',
        'Every build session ends with a written handover note.',
        'Secrets stay in .env; the WordPress dump with credentials was removed from git history.',
      ],
    },
    af: {
      chip: 'Eie besigheid',
      tagline: "'n Webwinkel herbou rondom hoe die besigheid regtig verkoop: op WhatsApp.",
      ability:
        'Rekeninge met net ’n selnommer, en WhatsApp-bestellingsboodskappe vir kliënte sonder e-pos',
      role: 'Eienaar, ontwerper en ontwikkelaar',
      status: 'Lewendig',
      summary:
        "HCreations Embroidery Blanks is my eie besigheid: ek verskaf borduur-blanks aan borduurders en herverkopers regoor Suid-Afrika. Ek het die WooCommerce-winkel vervang met 'n Laravel-API en 'n Vue-winkelfront en -admin wat gebou is vir die manier waarop ons werk.",
      sections: [
        {
          heading: 'Die probleem',
          paragraphs: [
            "WooCommerce en Elementor is vir 'n ander soort besigheid gebou. Die meeste van ons verkope gebeur op WhatsApp. Sommige kliënte het glad nie 'n e-posadres nie. Elke produk kom in enige van ons bindingkleure, en die bindingvoorraad word oor al die produkte gedeel. Aflewerings gaan na Pudo-kassies, nie na straatadresse nie. Elkeen daarvan het nog 'n plugin of nog 'n kortpad beteken.",
          ],
        },
        {
          heading: 'Wat ek gebou het',
          paragraphs: [
            "'n Laravel 13-API op PostgreSQL met 'n Vue 3 + TypeScript-winkelfront en -admin, in Engels en Afrikaans:",
          ],
          points: [
            "Rekeninge met net 'n selnommer. Wagwoorde vir daardie kliënte word deur die admin of oor WhatsApp herstel.",
            "In die admin kan elke bestelling 'n vooraf-ingevulde WhatsApp-boodskap stuur: bestellingstatus, betaalherinnering of gestuur. 'n Volle WhatsApp Business API-integrasie, sodat WhatsApp-bestellings ook in die stelsel beland, is aan die gang.",
            "'n Betaalproses rondom Pudo-kassies, met kaartbetalings deur iKhokha en EFT, albei agter een betaalpoort-koppelvlak.",
            "Fakture en pakstrokies as PDF's, en 'n teksredigeerder vir die winkel se eie bladsye.",
            "'n Invoerder wat produkte, kliënte, bestellings en instellings uit WordPress geskuif het en 'n verslag skryf van wat dit gedoen het. Dit kan veilig weer loop.",
          ],
        },
        {
          heading: 'Die moeilike deel',
          paragraphs: [
            'Dit is die eerste stelsel wat ek van die skerm tot die bediener besit, en ek is ook die hoofgebruiker. Die moeilikste was die voorraadlogika vir bindings wat elke produk deel, en om WhatsApp in die bestellingsvloei in te pas sonder om iets uit die oog te verloor.',
            'Ek het sommer ook die besigheid self vereenvoudig: minder handwerk tussen ’n WhatsApp-boodskap en ’n gepakte bestelling.',
          ],
        },
      ],
      notes: [
        'Monorepo met die API, die SPA en Docker; een PowerShell-opdrag begin alles.',
        'en.json is die skema vir vertalings; die bou faal as Afrikaans ’n sleutel kortkom.',
        'Koplose blaaier-QA-skripte in Docker, en Lighthouse 90+ op selfoon vir die tuis- en produkbladsye.',
        "Elke bousessie eindig met 'n geskrewe oorhandigingsnota.",
        'Geheime bly in .env; die WordPress-dump met wagwoorde is uit die git-geskiedenis verwyder.',
      ],
    },
  },
}

export const caseStudies: Record<CaseStudySlug, CaseStudy> = {
  'few-cutting-tools': few,
  'embroidery-blanks': embroideryBlanks,
}

/** In the order they appear on the site. */
export const caseStudyList: CaseStudy[] = [few, embroideryBlanks]
