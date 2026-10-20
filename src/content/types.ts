import type { Locale } from '@/site'

/** One value per language. The type makes a missing translation a compile error. */
export type Localized<T> = Record<Locale, T>

export interface Link {
  href: string
  label: string
}

export interface StorySection {
  heading: string
  paragraphs: string[]
  points?: string[]
}

export const CASE_STUDY_SLUGS = ['few-cutting-tools', 'embroidery-blanks'] as const
export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number]

export interface CaseStudyCopy {
  /** Short label on the card, e.g. "Legacy rescue". */
  chip: string
  /** One line under the title. */
  tagline: string
  /** The card's "ability": what the system does that matters most. */
  ability: string
  role: string
  status: string
  /** Meta description and intro paragraph. */
  summary: string
  sections: StorySection[]
  /** Engineering details an employer would look for. */
  notes: string[]
}

export interface CaseStudy {
  slug: CaseStudySlug
  name: string
  stack: string[]
  links: Localized<Link[]>
  copy: Localized<CaseStudyCopy>
}

/** Page path of a case study (a member of PAGE_PATHS in src/site.ts). */
export function caseStudyPath(slug: CaseStudySlug) {
  return `work/${slug}` as const
}
