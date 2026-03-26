import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

type EmailDispatchRecord = {
  idempotencyKey: string
  createdAt: string
  gmailMessageId: string
  gmailThreadId?: string
  to: string
  subject: string
  courseLevel: string
}

function getStoreDir() {
  return import.meta.env.EMAIL_DISPATCH_STORE_DIR || path.resolve(process.cwd(), '.runtime', 'email-dispatch')
}

function getRecordPath(idempotencyKey: string) {
  const hash = createHash('sha256').update(idempotencyKey).digest('hex')
  return path.join(getStoreDir(), `${hash}.json`)
}

export async function readEmailDispatchRecord(idempotencyKey: string) {
  try {
    const file = await readFile(getRecordPath(idempotencyKey), 'utf8')
    return JSON.parse(file) as EmailDispatchRecord
  } catch {
    return null
  }
}

export async function writeEmailDispatchRecord(record: EmailDispatchRecord) {
  const dir = getStoreDir()
  await mkdir(dir, { recursive: true })
  await writeFile(getRecordPath(record.idempotencyKey), JSON.stringify(record, null, 2), 'utf8')
}
