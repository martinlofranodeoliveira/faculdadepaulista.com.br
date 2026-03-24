import type { APIRoute } from 'astro'

export const prerender = false

type RawPole = {
  id?: number | string | null
  name?: string | null
  city_text?: string | null
  city_name?: string | null
  state_uf?: string | null
  uf?: string | null
  state_name?: string | null
  status?: string | null
}

type PolesEnvelope = {
  data?: RawPole[]
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
  errors?: Array<{
    message?: string
  }>
  message?: string
}

type PoleOption = {
  id: number
  name: string
  city: string
  stateUf: string
  stateName: string
}

const CACHE_TTL_MS = 1000 * 60 * 10

let polesCache:
  | {
      expiresAt: number
      items: PoleOption[]
    }
  | undefined

function readServerEnv(name: keyof ImportMetaEnv | string): string | undefined {
  const viteEnv = (import.meta.env as Record<string, string | boolean | undefined> | undefined) ?? undefined
  const viteValue = viteEnv?.[name]
  if (typeof viteValue === 'string' && viteValue.trim()) return viteValue

  const processValue = process.env[name]
  if (typeof processValue === 'string' && processValue.trim()) return processValue

  return undefined
}

function normalizeBaseUrl(value: string | undefined): string {
  const normalized = value?.trim() ?? ''
  if (!normalized) return ''
  return normalized.endsWith('/') ? normalized : `${normalized}/`
}

function baseHasPublicPrefix(baseUrl: string): boolean {
  if (!baseUrl) return false

  try {
    const pathname = new URL(baseUrl).pathname.replace(/\/+$/, '')
    return /\/api\/v1\/public$/i.test(pathname)
  } catch {
    return /\/api\/v1\/public\/?$/i.test(baseUrl)
  }
}

function buildPublicApiUrl(path: string): string {
  const baseUrl = normalizeBaseUrl(readServerEnv('COURSES_API_BASE_URL'))
  if (!baseUrl) throw new Error('COURSES_API_BASE_URL não configurada.')

  const normalizedPath = path.replace(/^\/+/, '')
  const apiPath = baseHasPublicPrefix(baseUrl)
    ? normalizedPath
    : `api/v1/public/${normalizedPath}`

  return new URL(apiPath, baseUrl).toString()
}

function buildHeaders(): Record<string, string> {
  const apiKey = readServerEnv('COURSES_API_KEY')
  const institutionId = readServerEnv('COURSES_API_INSTITUTION_ID')

  if (!apiKey) throw new Error('COURSES_API_KEY não configurada.')
  if (!institutionId) throw new Error('COURSES_API_INSTITUTION_ID não configurada.')

  return {
    Accept: 'application/json',
    'X-API-Key': apiKey,
    'X-Institution-Id': institutionId,
  }
}

function normalizePole(raw: RawPole): PoleOption | null {
  const id =
    typeof raw.id === 'number'
      ? raw.id
      : typeof raw.id === 'string' && raw.id.trim()
        ? Number.parseInt(raw.id, 10)
        : NaN

  if (!Number.isFinite(id) || id <= 0) return null

  const name = raw.name?.trim() ?? ''
  const city = raw.city_text?.trim() || raw.city_name?.trim() || ''
  const stateUf = (raw.state_uf?.trim() || raw.uf?.trim() || '').toUpperCase()
  const stateName = raw.state_name?.trim() ?? stateUf
  const status = raw.status?.trim().toLowerCase() ?? ''

  if (!name || !city || !stateUf || (status && status !== 'active')) return null

  return {
    id,
    name,
    city,
    stateUf,
    stateName,
  }
}

async function fetchPolesPage(page: number, limit = 100): Promise<PolesEnvelope> {
  const response = await fetch(buildPublicApiUrl(`poles?page=${page}&limit=${limit}`), {
    method: 'GET',
    headers: buildHeaders(),
  })

  const payload = (await response.json().catch(() => null)) as PolesEnvelope | null
  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.errors?.find((item) => item?.message)?.message ||
        'Não foi possível carregar os polos.',
    )
  }

  return payload ?? {}
}

async function loadAllPoles(): Promise<PoleOption[]> {
  if (polesCache && polesCache.expiresAt > Date.now()) {
    return polesCache.items
  }

  const items: PoleOption[] = []
  let page = 1
  let total = Infinity
  const limit = 100

  while (items.length < total) {
    const payload = await fetchPolesPage(page, limit)
    const normalizedItems = Array.isArray(payload.data)
      ? payload.data.map(normalizePole).filter((item): item is PoleOption => Boolean(item))
      : []

    items.push(...normalizedItems)

    const metaTotal =
      typeof payload.meta?.total === 'number' && Number.isFinite(payload.meta.total)
        ? payload.meta.total
        : items.length

    total = metaTotal
    if (!normalizedItems.length) break

    page += 1
  }

  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()].sort((left, right) => {
    return (
      left.stateUf.localeCompare(right.stateUf, 'pt-BR') ||
      left.city.localeCompare(right.city, 'pt-BR') ||
      left.name.localeCompare(right.name, 'pt-BR')
    )
  })

  polesCache = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    items: uniqueItems,
  }

  return uniqueItems
}

export const GET: APIRoute = async () => {
  try {
    const items = await loadAllPoles()
    return new Response(
      JSON.stringify({
        data: { items },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'private, max-age=300',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Não foi possível carregar os polos.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    )
  }
}
