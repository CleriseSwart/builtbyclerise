import type { RouteRecordRaw } from 'vue-router'

import SiteLayout from '@/layouts/SiteLayout.vue'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/site'

const localeParam = `:locale(${SUPPORTED_LOCALES.join('|')})`
const CaseStudyPage = () => import('@/pages/CaseStudyPage.vue')

// Child paths must stay in sync with PAGE_PATHS in src/site.ts (the prerender and sitemap list);
// src/router/routes.test.ts checks that.
export const pageRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: 'work', name: 'work', component: () => import('@/pages/WorkPage.vue') },
  {
    path: 'work/few-cutting-tools',
    name: 'case-few-cutting-tools',
    component: CaseStudyPage,
    props: { slug: 'few-cutting-tools' },
  },
  {
    path: 'work/embroidery-blanks',
    name: 'case-embroidery-blanks',
    component: CaseStudyPage,
    props: { slug: 'embroidery-blanks' },
  },
  { path: 'about', name: 'about', component: () => import('@/pages/AboutPage.vue') },
  { path: 'contact', name: 'contact', component: () => import('@/pages/ContactPage.vue') },
]

export const routes: RouteRecordRaw[] = [
  // In production Cloudflare Pages answers "/" with public/_redirects; this covers the dev server.
  { path: '/', redirect: `/${DEFAULT_LOCALE}` },
  { path: `/${localeParam}`, component: SiteLayout, children: pageRoutes },
  {
    path: '/:pathMatch(.*)*',
    component: SiteLayout,
    children: [
      { path: '', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
    ],
  },
]
