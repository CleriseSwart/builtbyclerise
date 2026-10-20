import { useHead } from '@unhead/vue'

import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/content/career'
import { SITE_URL } from '@/site'

/** schema.org Person (JSON-LD) for the home and about pages. */
export function usePersonSchema() {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        key: 'person-schema',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Clérise Swart',
          jobTitle: 'Software Engineer',
          url: SITE_URL,
          email: `mailto:${EMAIL}`,
          sameAs: [LINKEDIN_URL, GITHUB_URL],
          address: { '@type': 'PostalAddress', addressCountry: 'ZA' },
          knowsAbout: ['Vue.js', 'TypeScript', 'Laravel', 'PostgreSQL', 'Web development'],
          knowsLanguage: ['en', 'af'],
        }),
      },
    ],
  })
}
