#!/bin/bash

echo "🖼️  Начинаю массовую оптимизацию изображений..."

# Установить зависимости если нужны
command -v jpegoptim >/dev/null 2>&1 || apt-get install -y jpegoptim
command -v optipng >/dev/null 2>&1 || apt-get install -y optipng
command -v webp >/dev/null 2>&1 || apt-get install -y webp

# Оптимизировать все JPG
find public -name "*.jpg" -type f -exec jpegoptim --size=200k --strip-all {} \;

# Оптимизировать все PNG
find public -name "*.png" -type f -exec optipng -o3 {} \;

# Создать WebP версии
find public -name "*.jpg" -o -name "*.png" | while read img; do
  cwebp -q 85 "$img" -o "${img%.*}.webp" 2>/dev/null || true
done

echo "✅ Массовая оптимизация завершена!"
