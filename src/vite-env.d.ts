/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_NOINDEX?: string
  readonly VITE_CRM_LEAD_ENDPOINT?: string
  readonly VITE_CRM_API_KEY?: string
  readonly VITE_CRM_BEARER_TOKEN?: string
  readonly VITE_CRM_EMPRESA?: string
  readonly VITE_CRM_ETAPA_GRAD?: string
  readonly VITE_CRM_ETAPA_POS?: string
  readonly VITE_CRM_FUNIL_GRAD?: string
  readonly VITE_CRM_FUNIL_POS?: string
  readonly VITE_CRM_STATUS_LEAD?: string
  readonly VITE_CRM_FONTE_ID?: string
  readonly VITE_CRM_FONTE_TEXTO?: string
  readonly VITE_CRM_ORIGEM?: string
  readonly VITE_CRM_POLO?: string
  readonly VITE_POST_COURSES_CACHE_TTL_MS?: string
  readonly COURSES_API_BASE_URL?: string
  readonly COURSES_API_KEY_FASUL?: string
  readonly COURSES_API_KEY_UNICESP?: string
  readonly COURSES_API_INSTITUTION_ID_FASUL?: string
  readonly COURSES_API_INSTITUTION_ID_UNICESP?: string
  readonly COURSES_API_CACHE_TTL_MS?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
