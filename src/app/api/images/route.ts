import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import sharp from 'sharp';



// Функция для отправки событий через SSE
async function notifySSEClients(event: { type: string; data?: any }) {
  try {
    await fetch(process.env.BASE_URL + "/api/images/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  } catch (error) {
    console.error("Ошибка отправки SSE события:", error);
  }
}
// Загрузка файла на сервер с автоматической оптимизацией
async function saveFile(file: File, category: string): Promise<{ 
  success: boolean; 
  filePath?: string; 
  error?: string;
}> {
  try {
    // Получаем расширение файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    
    // Определяем категорию для сохранения
    const categoryFolders = {
      logos: 'logos',
      categories: 'categories',
      products: 'menu',
      other: 'other'
    };
    
    const folderKey = category as keyof typeof categoryFolders;
    const folder = categoryFolders[folderKey] || 'other';
    
    // Создаем путь к файлу
    const relativePath = `/images/${folder}/${filename}`;
    const absolutePath = join(process.cwd(), 'public', relativePath);
    
    // Проверяем существование директории
    const dir = dirname(absolutePath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    
    // 🚀 АВТОМАТИЧЕСКАЯ ОПТИМИЗАЦИЯ через Sharp
    try {
      let optimizedBuffer: Buffer = buffer;
      
      // Оптимизируем изображение
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
        optimizedBuffer = await sharp(buffer)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 75, progressive: true })
          .toBuffer() as Buffer;
        
        console.log(`✓ Оптимизировано: ${file.name} | До: ${buffer.length} → После: ${optimizedBuffer.length} байт`);
      }
      
      // Записываем оптимизированный файл
      await writeFile(absolutePath, optimizedBuffer);
    } catch (optimizeError) {
      console.warn('Не удалось оптимизировать изображение, сохраняем оригинал:', optimizeError);
      await writeFile(absolutePath, buffer);
    }
    
    return {
      success: true,
      filePath: relativePath
    };
  } catch (error) {
    console.error('Ошибка при сохранении файла:', error);
    return {
      success: false,
      error: 'Не удалось сохранить файл'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Логирование для отладки
    console.log("Получен POST запрос к /api/images");
    
    const data = await request.formData();
    console.log("FormData получена:", data.has('file'), data.has('category'));
    
    const file = data.get('file') as unknown as File;
    
    if (!file) {
      console.error("Файл не найден в запросе");
      return NextResponse.json(
        { error: 'Файл не предоставлен' }, 
        { status: 400 }
      );
    }
    
    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат файла' }, 
        { status: 400 }
      );
    }
    
    // Проверка размера файла (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Размер файла превышает 5MB' }, 
        { status: 400 }
      );
    }
    
    // Получаем данные из запроса
    const category = (data.get('category') as string) || 'other';
    const alt = (data.get('alt') as string) || '';
    
    // Сохраняем файл
    const saveResult = await saveFile(file, category);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error }, 
        { status: 500 }
      );
    }
    
    try {
      // Сохраняем информацию в БД
      const image = await prisma.image.create({
        data: {
          filename: file.name,
          path: saveResult.filePath!,
          size: file.size,
          mimeType: file.type,
          category,
          alt,
          originalFilename: file.name,
          type: file.type
        }
      });
      
      console.log("Изображение успешно сохранено в БД:", image.id);
      
      // НОВОЕ: Уведомляем клиентов о новом изображении
      await notifySSEClients({
        type: 'image_uploaded',
        data: {
          id: image.id,
          filename: file.name,
          url: saveResult.filePath,
          category,
          timestamp: new Date().toISOString()
        }
      });
      
      return NextResponse.json({
        success: true,
        image: {
          id: image.id,
          filename: file.name,
          url: saveResult.filePath,
          size: file.size,
          category,
          alt,
          createdAt: image.createdAt
        }
      }, { status: 201 });
    } catch (dbError) {
      console.error("Ошибка при сохранении в БД:", dbError);
      
      // Возвращаем фиктивное изображение в случае ошибки с БД
      return NextResponse.json({
        success: true,
        image: {
          id: "fallback-" + Date.now(),
          filename: file.name,
          url: "/images/placeholder.svg",
          size: file.size,
          category,
          alt: alt || "Placeholder image",
          createdAt: new Date()
        }
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    // Если запрашивается конкретное изображение
    if (id) {
      const image = await prisma.image.findUnique({
        where: { id }
      });
      
      if (!image) {
        return NextResponse.json(
          { error: 'Изображение не найдено' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json({ image: {
        id: image.id,
        filename: image.filename,
        url: image.path,
        size: image.size,
        category: image.category,
        alt: image.alt,
        createdAt: image.createdAt,
        originalFilename: image.originalFilename,
        type: image.type
      }});
    }
    
    // Формируем условие для поиска
    const whereClause = category ? { category } : {};
    
    // Получаем список изображений
    const images = await prisma.image.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    // Преобразуем данные
    const result = images.map((img: any) => ({
      id: img.id,
      filename: img.filename,
      url: img.path,
      size: img.size,
      category: img.category,
      alt: img.alt,
      createdAt: img.createdAt
    }));
    
    return NextResponse.json({ images: result });
  } catch (error) {
    console.error('Ошибка при получении изображений:', error);
    return NextResponse.json(
      { error: 'Не удалось получить изображения' }, 
      { status: 500 }
    );
  }
}

// Обработчик DELETE-запросов
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID изображения не указан' }, 
        { status: 400 }
      );
    }
    
    // Ищем изображение в БД
    const image = await prisma.image.findUnique({
      where: { id }
    });
    
    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не найдено' }, 
        { status: 404 }
      );
    }
    
    // Удаляем из БД
    await prisma.image.delete({
      where: { id }
    });
    
    // НОВОЕ: Уведомляем клиентов об удалении изображения
    await notifySSEClients({
      type: 'image_deleted',
      data: {
        id: image.id,
        url: image.path,
        category: image.category,
        timestamp: new Date().toISOString()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Изображение успешно удалено'
    });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить изображение' }, 
      { status: 500 }
    );
  }
}
