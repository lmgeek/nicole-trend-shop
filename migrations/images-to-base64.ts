import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nicole-trend-shop';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function fileToBase64(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
    return null;
  }
}

function urlToBase64(url: string): string | null {
  if (!url || url.startsWith('data:')) return url;
  if (url.startsWith('/')) {
    const filePath = path.join(PUBLIC_DIR, url);
    return fileToBase64(filePath);
  }
  return url;
}

async function migrateImagesToBase64() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado!');

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', new mongoose.Schema({}, { strict: false }));

  // Migrar productos
  console.log('\n📦 Migrando productos...');
  const products = await Product.find({});
  let productUpdated = 0;

  for (const product of products) {
    if (product.images && product.images.length > 0) {
      const newImages = product.images.map((img: string) => urlToBase64(img) || img);
      const hasChanges = newImages.some((img: string, i: number) => img !== product.images[i]);
      
      if (hasChanges) {
        await Product.findByIdAndUpdate(product._id, { images: newImages });
        productUpdated++;
        console.log(`  ✅ ${product.name}: ${product.images.length} imagen(es) convertida(s)`);
      }
    }
  }
  console.log(`  ${productUpdated} productos actualizados`);

  // Migrar categorías
  console.log('\n📁 Migrando categorías...');
  const categories = await Category.find({});
  let categoryUpdated = 0;

  for (const category of categories) {
    if (category.image && !category.image.startsWith('data:')) {
      const base64 = urlToBase64(category.image);
      if (base64 && base64 !== category.image) {
        await Category.findByIdAndUpdate(category._id, { image: base64 });
        categoryUpdated++;
        console.log(`  ✅ ${category.name}: imagen convertida`);
      }
    }
  }
  console.log(`  ${categoryUpdated} categorías actualizadas`);

  // Migrar hero slides
  console.log('\n🎨 Migrando hero slides...');
  const slides = await HeroSlide.find({});
  let slideUpdated = 0;

  for (const slide of slides) {
    if (slide.image && !slide.image.startsWith('data:')) {
      const base64 = urlToBase64(slide.image);
      if (base64 && base64 !== slide.image) {
        await HeroSlide.findByIdAndUpdate(slide._id, { image: base64 });
        slideUpdated++;
        console.log(`  ✅ ${slide.title || slide.type}: imagen convertida`);
      }
    }
  }
  console.log(`  ${slideUpdated} hero slides actualizadas`);

  console.log('\n🎉 Migración completada!');
  await mongoose.disconnect();
  process.exit(0);
}

migrateImagesToBase64().catch((err) => {
  console.error('Error en la migración:', err);
  process.exit(1);
});
