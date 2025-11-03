import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: restaurantId } = await params;

    // Получаем категории конкретного ресторана
    const categories = await prisma.category.findMany({
      where: {
        status: true,
        restaurantId: parseInt(restaurantId)
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    // Преобразуем данные в формат, ожидаемый фронтендом
  const formattedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.nameRu,
      nameTk: cat.nameTk,
      description: cat.descriptionRu,
      descriptionTk: cat.descriptionTk,
      image: cat.imageCard,
      dishPageImage: cat.imageBackground,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-700', // Дефолтный градиент
      isActive: cat.status,
      sortOrder: cat.order,
      dishes: [] // Пустой массив, блюда будем загружать отдельно при необходимости
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Ошибка при получении категорий ресторана:', error);
    return NextResponse.json({ error: 'Ошибка при получении категорий' }, { status: 500 });
  }
}