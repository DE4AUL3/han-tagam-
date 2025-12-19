import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'UNDEFINED',
    HAS_PASSWORD: !!process.env.ADMIN_PASSWORD_HASH,
    HAS_JWT: !!process.env.JWT_SECRET,
    HAS_DB: !!process.env.DATABASE_URL
  });
}
