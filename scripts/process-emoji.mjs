import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const SRC  = 'C:/Users/enisv/Desktop/emoji'
const DEST = './public/emoji'
mkdirSync(DEST, { recursive: true })

/** Remove white/near-white background → transparent */
async function removeWhiteBg(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const buf = Buffer.from(data)
  const { width, height, channels } = info

  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i], g = buf[i+1], b = buf[i+2]
    // white or near-white → transparent
    if (r > 230 && g > 230 && b > 230) {
      buf[i+3] = 0
    }
  }

  return sharp(buf, { raw: { width, height, channels } })
}

/** Auto-crop: trim transparent edges, add small padding */
async function autoCrop(sharpInst, pad = 8) {
  const buf = await sharpInst.png().toBuffer()
  return sharp(buf).trim({ threshold: 10 })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r:0, g:0, b:0, alpha:0 } })
}

/** Full pipeline: remove bg + crop + resize to 120px square */
async function process(inputPath, outputName) {
  console.log('Processing', outputName)
  const removed = await removeWhiteBg(inputPath)
  const cropped  = await autoCrop(removed)
  await cropped
    .resize(120, 120, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } })
    .png()
    .toFile(join(DEST, outputName))
  console.log('  ✓', outputName)
}

/** Split left/right halves of a side-by-side image, then process each */
async function splitAndProcess(inputPath, leftName, rightName) {
  const meta = await sharp(inputPath).metadata()
  const half = Math.floor(meta.width / 2)

  const leftBuf  = await sharp(inputPath).extract({ left: 0,    top: 0, width: half,               height: meta.height }).toBuffer()
  const rightBuf = await sharp(inputPath).extract({ left: half, top: 0, width: meta.width - half,  height: meta.height }).toBuffer()

  const lRemoved = await removeWhiteBg(leftBuf)
  const rRemoved = await removeWhiteBg(rightBuf)

  const lCropped = await autoCrop(lRemoved)
  const rCropped = await autoCrop(rRemoved)

  await lCropped.resize(120, 120, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } }).png().toFile(join(DEST, leftName))
  console.log('  ✓', leftName)
  await rCropped.resize(120, 120, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } }).png().toFile(join(DEST, rightName))
  console.log('  ✓', rightName)
}

// ── Run ───────────────────────────────────────────────────────────────────────

// Image 1: lighthouse + theater side by side → split into 2
await splitAndProcess(
  join(SRC, '73e47478-cfb2-485c-a631-c9a94a50f98f.png'),
  'leuchtturm.png',
  'theater.png'
)

// Image 2: seal/park — already has colored bg, just crop + resize
await sharp(join(SRC, '7a1e842c-1516-4cd2-8405-5c22c359db2d.png'))
  .resize(120, 120, { fit: 'cover' })
  .png()
  .toFile(join(DEST, 'robbe.png'))
console.log('  ✓ robbe.png')

// Image 3: tower/monument on white bg
await process(join(SRC, 'aa6e839a-bc6a-4a5e-b611-a7f9fad0f873.png'), 'tower.png')

// Image 5: obelisk/monument on white bg
await process(join(SRC, 'd8a4d3db-8d7a-43b9-a20a-55600657e3d5.png'), 'denkmal.png')

console.log('\nDone! All emoji images saved to public/emoji/')
