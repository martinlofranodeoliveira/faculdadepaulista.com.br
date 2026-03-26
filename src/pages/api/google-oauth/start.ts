import type { APIRoute } from 'astro'

import { buildGoogleAuthorizeUrl, parseGoogleOAuthMailbox } from '@/lib/googleOAuth'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const mailbox = parseGoogleOAuthMailbox(url.searchParams.get('mailbox'))

  if (!mailbox) {
    return new Response('Mailbox inválido. Use "graduacao" ou "posgraduacao".', { status: 400 })
  }

  try {
    return Response.redirect(buildGoogleAuthorizeUrl(mailbox), 302)
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : 'Não foi possível iniciar o fluxo OAuth.',
      { status: 500 },
    )
  }
}

