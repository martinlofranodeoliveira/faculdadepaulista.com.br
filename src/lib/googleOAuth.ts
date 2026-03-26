export type GoogleOAuthMailbox = 'graduacao' | 'posgraduacao'

type GoogleTokenSuccess = {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

type GoogleTokenError = {
  error?: string
  error_description?: string
}

const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send'

function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`)
  }

  return value
}

export function parseGoogleOAuthMailbox(value: string | null | undefined): GoogleOAuthMailbox | null {
  if (value === 'graduacao' || value === 'posgraduacao') return value
  return null
}

export function getGoogleOAuthSenderAddress(mailbox: GoogleOAuthMailbox): string {
  if (mailbox === 'graduacao') {
    return import.meta.env.GOOGLE_GMAIL_GRAD_ADDRESS || 'graduacao@faculdadepaulista.com.br'
  }

  return import.meta.env.GOOGLE_GMAIL_POS_ADDRESS || 'posgraduacao@faculdadepaulista.com.br'
}

export function getGoogleOAuthRedirectUri() {
  return readEnv('GOOGLE_OAUTH_REDIRECT_URI')
}

export function getGoogleRefreshTokenEnvName(mailbox: GoogleOAuthMailbox) {
  return mailbox === 'graduacao'
    ? 'GOOGLE_REFRESH_TOKEN_GRADUACAO'
    : 'GOOGLE_REFRESH_TOKEN_POSGRADUACAO'
}

export function buildGoogleAuthorizeUrl(mailbox: GoogleOAuthMailbox) {
  const params = new URLSearchParams({
    client_id: readEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: getGoogleOAuthRedirectUri(),
    response_type: 'code',
    scope: GMAIL_SEND_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    login_hint: getGoogleOAuthSenderAddress(mailbox),
    state: mailbox,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeGoogleAuthorizationCode(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: readEnv('GOOGLE_CLIENT_ID'),
    client_secret: readEnv('GOOGLE_CLIENT_SECRET'),
    redirect_uri: getGoogleOAuthRedirectUri(),
    grant_type: 'authorization_code',
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const payload = (await response.json()) as GoogleTokenSuccess & GoogleTokenError

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || 'Falha ao trocar o código por token.')
  }

  return payload
}

