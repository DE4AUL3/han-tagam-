import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Incoming request body:', body);
    const {
      nameRu,
      nameTk,
      descriptionRu,
      descriptionTk,
      imageCard,
      imageBackground,
      order,
      status,
      restaurantId
    } = body;

    // Валидация обязательных полей
    if (!nameRu || !nameTk || order === undefined || !restaurantId) {
      return NextResponse.json({ error: 'Заполните обязательные поля: nameRu, nameTk, order, restaurantId' }, { status: 400 });
    }

    // Создаём категорию и одновременно гарантируем ресторан через connectOrCreate
    const category = await prisma.category.create({
      data: {
        nameRu,
        nameTk,
        descriptionRu: descriptionRu || '',
        descriptionTk: descriptionTk || '',
        imageCard: imageCard || '',
        imageBackground: imageBackground || '',
        order,
        status: status ?? true,
        restaurant: {
          connectOrCreate: {
            where: { id: restaurantId },
            create: { 
              id: restaurantId, 
              slug: String(restaurantId), 
              name: String(restaurantId) 
            },
          },
        },
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания категории:', error);
    const message = error instanceof Error ? error.message : 'Ошибка создания категории';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Получаем все категории, сортируем по полю order
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return NextResponse.json({ error: 'Ошибка получения категорий' }, { status: 500 });
  }
}
