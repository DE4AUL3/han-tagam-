import { NextRequest, NextResponse } from 'next/server';

// Простая фиксированная стоимость доставки
const DEFAULT_DELIVERY_FEE = 50; // ТМТ

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      deliveryFee: DEFAULT_DELIVERY_FEE,
      currency: 'ТМТ'
    });
  } catch (error) {
    console.error('Ошибка при получении стоимости доставки:', error);
    return NextResponse.json(
      { error: 'Не удалось получить стоимость доставки' },
      { status: 500 }
    );
  }
}

// Функция для получения стоимости доставки
export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json();
    
    // Просто возвращаем фиксированную стоимость
    return NextResponse.json({
      success: true,
      deliveryFee: DEFAULT_DELIVERY_FEE,
      currency: 'ТМТ'
    });
  } catch (error) {
    console.error('Ошибка при расчете стоимости доставки:', error);
    return NextResponse.json(
      { error: 'Не удалось рассчитать стоимость доставки' },
      { status: 500 }
    );
  }
}
