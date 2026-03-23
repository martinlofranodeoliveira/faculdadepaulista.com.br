import type { APIRoute } from 'astro'

import { buildSitemapXml, getSitemapEntries } from '@/lib/sitemap'

export const prerender = false

function resolveCacheControlHeader(): string {
  const rawTtl = import.meta.env.VITE_POST_COURSES_CACHE_TTL_MS
  const ttlInMilliseconds = rawTtl ? Number.parseInt(rawTtl, 10) : 300000

  if (!Number.isFinite(ttlInMilliseconds) || ttlInMilliseconds <= 0) {
    return 'no-store'
  }

  const ttlInSeconds = Math.max(60, Math.floor(ttlInMilliseconds / 1000))
  return `public, max-age=0, s-maxage=${ttlInSeconds}, stale-while-revalidate=${ttlInSeconds}`
}

export const GET: APIRoute = async () => {
  const entries = await getSitemapEntries()
  const xml = buildSitemapXml(entries)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': resolveCacheControlHeader(),
    },
  })
}
