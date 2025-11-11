import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

  // Построение условия поиска
  const whereCondition: any = {};
    
    if (status) {
      if (status === 'active') {
        whereCondition.status = {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
        };
      } else if (status === 'history') {
        whereCondition.status = {
          in: ['DELIVERED', 'CANCELLED'],
        };
      } else if (status !== 'all') {
        // Приводим строковой параметр к UpperCase и валидируем против допустимых значений статусов
        const upper = status.toUpperCase();
        const allowed = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
        if (allowed.includes(upper)) {
          whereCondition.status = upper;
        }
      }
    }

    // Получаем заказы с элементами и связанными блюдами
    const orders = await prisma.order.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: true,
        orderItems: {
          include: {
            meal: true,
          },
        },
      },
    });

    // Преобразуем данные в формат, ожидаемый на фронтенде
  const formattedOrders = orders.map((order: any) => {
      // Преобразуем статус из ENUM в нижний регистр для соответствия интерфейсу
      let status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
      const s = order.status.toLowerCase();
      // Соответствие между статусами Prisma и фронтенда
      if (s === 'pending') status = 'pending';
      else if (s === 'confirmed') status = 'confirmed';
      else if (s === 'preparing') status = 'preparing';
      else if (s === 'ready') status = 'ready';
      else if (s === 'delivered') status = 'delivered';
      else status = 'cancelled';
      
      return {
        id: order.id,
        customerName: order.client?.phoneNumber || order.phoneNumber,
        customerPhone: order.phoneNumber,
        totalAmount: order.totalAmount,
        status: status,
        notes: order.notes,
        address: order.address,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
  items: order.orderItems.map((item: any) => ({
          id: item.id,
          dishId: item.mealId,
          mealId: item.mealId, // Для совместимости с разными частями кода
          dishName: item.meal.nameRu,
          dishNameTk: item.meal.nameTk,
          price: item.price,
          quantity: item.amount,
          amount: item.amount, // Для совместимости с разными частями кода
          total: item.price * item.amount
        })),
        subtotal: order.orderItems.reduce((sum: number, item: any) => sum + item.price * item.amount, 0)
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Ошибка получения заказов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, phoneNumber, items, address, notes, totalAmount } = body;
    
    // Создаем заказ
    const newOrder = await prisma.order.create({
      data: {
        clientId,
        phoneNumber,
        totalAmount,
        status: 'PENDING',
        notes: notes || null,
        address: address || null,
        orderItems: {
          create: items.map((item: any) => ({
            mealId: item.mealId,
            price: item.price,
            amount: item.amount
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
    
    return NextResponse.json({
      id: newOrder.id,
      phoneNumber: newOrder.phoneNumber,
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      createdAt: newOrder.createdAt.toISOString(),
  items: newOrder.orderItems.map((item: any) => ({
        id: item.id,
        mealId: item.mealId,
        price: item.price,
        quantity: item.amount
      }))
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Ошибка создания заказа' }, { status: 500 });
  }
}