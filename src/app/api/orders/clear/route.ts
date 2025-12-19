import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return false;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'DELETE FROM orders';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      deleted: result.rowCount,
      message: `Удалено ${result.rowCount} заказов`,
    });
  } catch (error) {
    console.error('Clear orders error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении заказов' },
      { status: 500 }
    );
  }
}
