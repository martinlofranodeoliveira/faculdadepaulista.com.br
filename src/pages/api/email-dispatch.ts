import type { APIRoute } from 'astro'

import {
  parseGoogleOAuthMailbox,
  sendGmailMessage,
  type GmailAttachmentInput,
} from '@/lib/googleOAuth'
import { readEmailDispatchRecord, writeEmailDispatchRecord } from '@/lib/emailDispatchStore'

export const prerender = false

type EmailDispatchAttachmentPayload = {
  filename?: unknown
  content_type?: unknown
  url?: unknown
  content_base64?: unknown
}

type EmailDispatchPayload = {
  event?: unknown
  idempotency_key?: unknown
  course_level?: unknown
  journey_id?: unknown
  admission_id?: unknown
  student_id?: unknown
  to?: unknown
  cc?: unknown
  bcc?: unknown
  reply_to?: unknown
  subject?: unknown
  html?: unknown
  text?: unknown
  attachments?: unknown
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function readDispatchToken() {
  const token = import.meta.env.EMAIL_DISPATCH_WEBHOOK_TOKEN
  if (!token) throw new Error('Variável de ambiente obrigatória ausente: EMAIL_DISPATCH_WEBHOOK_TOKEN')
  return token
}

function parseBearerToken(header: string | null) {
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
}

async function resolveAttachment(attachment: EmailDispatchAttachmentPayload) {
  const filename = typeof attachment.filename === 'string' ? attachment.filename.trim() : ''
  const contentType = typeof attachment.content_type === 'string' ? attachment.content_type.trim() : ''

  if (!filename || !contentType) {
    throw new Error('Attachment inválido: filename e content_type são obrigatórios.')
  }

  if (typeof attachment.content_base64 === 'string' && attachment.content_base64.trim()) {
    return {
      filename,
      contentType,
      contentBase64: attachment.content_base64.trim(),
    } satisfies GmailAttachmentInput
  }

  if (typeof attachment.url === 'string' && attachment.url.trim()) {
    const response = await fetch(attachment.url.trim())
    if (!response.ok) {
      throw new Error(`Não foi possível baixar o anexo ${filename}.`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return {
      filename,
      contentType,
      contentBase64: Buffer.from(arrayBuffer).toString('base64'),
    } satisfies GmailAttachmentInput
  }

  throw new Error('Attachment inválido: envie url ou content_base64.')
}

async function parsePayload(body: EmailDispatchPayload) {
  const event = typeof body.event === 'string' ? body.event.trim() : ''
  const idempotencyKey =
    typeof body.idempotency_key === 'string' ? body.idempotency_key.trim() : ''
  const courseLevel = parseGoogleOAuthMailbox(
    typeof body.course_level === 'string' ? body.course_level.trim() : '',
  )
  const to = typeof body.to === 'string' ? body.to.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const html = typeof body.html === 'string' ? body.html : undefined
  const text = typeof body.text === 'string' ? body.text : undefined
  const replyTo = typeof body.reply_to === 'string' ? body.reply_to.trim() : undefined

  if (event !== 'admission_email_ready') {
    throw new Error('event inválido.')
  }

  if (!idempotencyKey) {
    throw new Error('idempotency_key é obrigatório.')
  }

  if (!courseLevel) {
    throw new Error('course_level inválido. Use graduacao ou posgraduacao.')
  }

  if (!to) {
    throw new Error('to é obrigatório.')
  }

  if (!subject) {
    throw new Error('subject é obrigatório.')
  }

  if (!html && !text) {
    throw new Error('html ou text é obrigatório.')
  }

  const attachmentsInput = Array.isArray(body.attachments)
    ? (body.attachments as EmailDispatchAttachmentPayload[])
    : []
  const attachments = await Promise.all(attachmentsInput.map(resolveAttachment))

  return {
    idempotencyKey,
    courseLevel,
    to,
    cc: parseStringArray(body.cc),
    bcc: parseStringArray(body.bcc),
    replyTo,
    subject,
    html,
    text,
    attachments,
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const token = parseBearerToken(request.headers.get('Authorization'))
    if (token !== readDispatchToken()) {
      return jsonResponse({ success: false, message: 'Não autorizado.' }, 401)
    }

    const body = (await request.json()) as EmailDispatchPayload
    const payload = await parsePayload(body)

    const existing = await readEmailDispatchRecord(payload.idempotencyKey)
    if (existing) {
      return jsonResponse({
        success: true,
        duplicate: true,
        message_id: existing.gmailMessageId,
      })
    }

    const result = await sendGmailMessage({
      mailbox: payload.courseLevel,
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      attachments: payload.attachments,
    })

    await writeEmailDispatchRecord({
      idempotencyKey: payload.idempotencyKey,
      createdAt: new Date().toISOString(),
      gmailMessageId: result.id,
      gmailThreadId: result.threadId,
      to: payload.to,
      subject: payload.subject,
      courseLevel: payload.courseLevel,
    })

    return jsonResponse({
      success: true,
      message_id: result.id,
      thread_id: result.threadId,
    })
  } catch (error) {
    console.error('Erro no disparo de e-mail:', error)

    return jsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Falha ao disparar e-mail.',
      },
      400,
    )
  }
}
