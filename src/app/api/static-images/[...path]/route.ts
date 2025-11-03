import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readFileSync, statSync } from 'fs';

// Простой сервер для статичных изображений с поддержкой обновления без перезагрузки
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/static-images', '');
    
    // Защита от выхода за пределы директории
    if (path.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Полный путь к файлу изображения в public/images
    const imagePath = join(process.cwd(), 'public', 'images', path);
    
    // Проверяем существование файла
    if (!existsSync(imagePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Получаем информацию о файле
    const stats = statSync(imagePath);
    const lastModified = stats.mtime.toUTCString();
    
    // Определяем MIME тип
    let contentType = 'image/jpeg';
    if (path.endsWith('.png')) contentType = 'image/png';
    if (path.endsWith('.webp')) contentType = 'image/webp';
    if (path.endsWith('.svg')) contentType = 'image/svg+xml';
    if (path.endsWith('.gif')) contentType = 'image/gif';
    
    // Читаем файл и возвращаем его содержимое
    const imageBuffer = readFileSync(imagePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': lastModified,
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
  }
}
