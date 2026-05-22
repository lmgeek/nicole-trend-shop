import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const marcasDir = path.join(process.cwd(), 'public/images/marcas');
const outputDir = path.join(process.cwd(), 'public/images/marcas-transparent');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(marcasDir).filter(f => f.endsWith('.png') || f.endsWith('.webp'));

async function removeWhiteBackground(file: string) {
  const inputPath = path.join(marcasDir, file);
  const outputPath = path.join(outputDir, file);

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const raw = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = raw;
  const threshold = 240;

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > threshold && g > threshold && b > threshold) {
      const brightness = (r + g + b) / 3;
      const alpha = Math.max(0, 255 - ((brightness - threshold) * (255 / (255 - threshold))));
      data[i + 3] = alpha;
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
  .png()
  .toFile(outputPath);

  console.log(`✓ ${file} procesado`);
}

(async () => {
  for (const file of files) {
    try {
      await removeWhiteBackground(file);
    } catch (err: any) {
      console.error(`✗ Error con ${file}: ${err.message}`);
    }
  }
  console.log('\nProcesamiento completado!');
})();
