import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  // Блокируем доступ к test-страницам в продакшн-окружении
  if (process.env.NODE_ENV === 'production' && req.nextUrl.pathname.startsWith('/test')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // JWT защита админ панели
  if (req.nextUrl.pathname.startsWith('/admin/dashboard') || 
      req.nextUrl.pathname.startsWith('/admin/orders') ||
      req.nextUrl.pathname.startsWith('/admin/restaurant')) {
    
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/|api/|static/|favicon.ico).*)'],
}
