import { NextRequest } from 'next/server';

// Глобальное хранилище для SSE соединений
const clients = new Set<any>();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Создаем readable stream для SSE
  const stream = new ReadableStream({
    start(controller) {
      // Создаем простой объект для управления клиентом
      const client = {
        send: (data: string) => {
          try {
            controller.enqueue(encoder.encode(data));
          } catch (error) {
            console.error('Ошибка отправки SSE:', error);
            clients.delete(client);
          }
        },
        close: () => {
          try {
            controller.close();
          } catch (error) {
            console.error('Ошибка закрытия SSE:', error);
          }
          clients.delete(client);
        }
      };
      
      // Добавляем клиента в список
      clients.add(client);
      
      // Отправляем первоначальное сообщение
      client.send('data: {"type":"connected"}\n\n');

      // Обработка закрытия соединения
      request.signal.addEventListener('abort', () => {
        client.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

// Отправка события всем подключенным клиентам
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    const message = `data: ${JSON.stringify(event)}\n\n`;
    
    clients.forEach((client: any) => {
      if (client && client.send) {
        client.send(message);
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      clientsCount: clients.size,
      event: event 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Ошибка в POST SSE:', error);
    return new Response(JSON.stringify({ error: 'Ошибка отправки события' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
