import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const targetDir = path.resolve(process.argv[2] ?? "public")
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(fullPath)
      return [fullPath]
    }),
  )
  return files.flat()
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (!SUPPORTED_EXTENSIONS.has(ext)) return null

  const inputBuffer = await fs.readFile(filePath)
  const image = sharp(inputBuffer)
  const metadata = await image.metadata()

  if (!metadata.format) return null

  let outputBuffer
  if (metadata.format === "jpeg") {
    outputBuffer = await image.jpeg({ quality: 78, mozjpeg: true }).toBuffer()
  } else if (metadata.format === "png") {
    outputBuffer = await image
      .png({ quality: 82, compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer()
  } else if (metadata.format === "webp") {
    outputBuffer = await image.webp({ quality: 80, effort: 6 }).toBuffer()
  } else {
    return null
  }

  if (outputBuffer.length >= inputBuffer.length) return null

  await fs.writeFile(filePath, outputBuffer)
  return {
    filePath,
    before: inputBuffer.length,
    after: outputBuffer.length,
    saved: inputBuffer.length - outputBuffer.length,
  }
}

async function main() {
  const files = await walk(targetDir)
  const results = []

  for (const file of files) {
    try {
      const optimized = await optimizeImage(file)
      if (optimized) results.push(optimized)
    } catch (error) {
      console.error(`Erro ao otimizar ${file}:`, error.message)
    }
  }

  const totalBefore = results.reduce((sum, item) => sum + item.before, 0)
  const totalAfter = results.reduce((sum, item) => sum + item.after, 0)
  const totalSaved = totalBefore - totalAfter

  console.log(`Imagens otimizadas: ${results.length}`)
  console.log(`Antes: ${formatBytes(totalBefore)}`)
  console.log(`Depois: ${formatBytes(totalAfter)}`)
  console.log(`Economia: ${formatBytes(totalSaved)}`)

  if (results.length > 0) {
    console.log("\nTop 10 ganhos:")
    results
      .sort((a, b) => b.saved - a.saved)
      .slice(0, 10)
      .forEach((item) => {
        console.log(
          `- ${path.relative(process.cwd(), item.filePath)}: ${formatBytes(item.saved)}`,
        )
      })
  }
}

main().catch((error) => {
  console.error("Falha ao otimizar imagens:", error)
  process.exit(1)
})
