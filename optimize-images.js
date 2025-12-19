const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  { input: 'public/panda_logo.jpg', output: 'public/panda_logo_optimized.jpg', width: 400 },
  { input: 'public/panda_logo.png', output: 'public/panda_logo_optimized.png', width: 400 },
  { input: 'public/han_tagam2..jpg', output: 'public/han_tagam_optimized.jpg', width: 400 },
  { input: 'public/images/han-tagam-logo.png', output: 'public/images/han-tagam-logo-optimized.png', width: 400 }
];

async function optimizeImages() {
  console.log('🖼️  Начинаю оптимизацию изображений...\n');
  
  for (const img of images) {
    try {
      if (!fs.existsSync(img.input)) {
        console.log(`⚠️  Пропускаю ${img.input} - файл не существует`);
        continue;
      }

      const stats = fs.statSync(img.input);
      const sizeBeforeMB = (stats.size / 1024 / 1024).toFixed(2);

      await sharp(img.input)
        .resize({ width: img.width, withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(img.output);

      // Также создаём WebP версию
      const webpOutput = img.output.replace(/\.(jpg|png)$/, '.webp');
      await sharp(img.input)
        .resize({ width: img.width, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(webpOutput);

      const newStats = fs.statSync(img.output);
      const sizeAfterMB = (newStats.size / 1024 / 1024).toFixed(2);
      const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(0);

      console.log(`✅ ${path.basename(img.input)}`);
      console.log(`   Было: ${sizeBeforeMB}MB → Стало: ${sizeAfterMB}MB (−${reduction}%)`);
      console.log(`   WebP: ${webpOutput}\n`);
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${img.input}:`, error.message);
    }
  }

  console.log('✨ Оптимизация завершена!');
}

optimizeImages();
