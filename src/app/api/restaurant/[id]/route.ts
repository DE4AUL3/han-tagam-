import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const r = await prisma.restaurant.findUnique({ where: { id: parseInt(id) } });
    if (!r) {
      return NextResponse.json({ error: 'Ресторан не найден' }, { status: 404 });
    }

    const restaurant = {
      id: r.id,
      slug: r.slug,
      name: r.name,
      logo: r.logo || '',
      description: r.description || '',
      descriptionTk: r.descriptionTk || '',
      cuisine: '',
      rating: r.rating || 0,
      phone: r.phone || '',
      address: r.address || '',
      image: r.image || '',
      gradient: r.gradient,
  features: Array.isArray(r.features) ? (r.features as unknown as string[]) : [],
      isOpen: r.is_open,
      deliveryTime: r.deliveryTime || '',
      deliveryTimeTk: r.deliveryTime || ''
    };

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Ошибка при получении данных ресторана:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных ресторана' }, { status: 500 });
  }
}