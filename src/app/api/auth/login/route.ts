import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

// Rate limiting store
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  const timeout = (parseInt(process.env.LOGIN_TIMEOUT_MINUTES!) || 15) * 60 * 1000;
  
  if (attempts) {
    if (now - attempts.lastAttempt < timeout && attempts.count >= (parseInt(process.env.MAX_LOGIN_ATTEMPTS!) || 5)) {
      return false;
    }
    if (now - attempts.lastAttempt >= timeout) {
      loginAttempts.delete(ip);
    }
  }
  return true;
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts) {
    attempts.count++;
    attempts.lastAttempt = now;
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    
    // Rate limiting check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много попыток входа. Попробуйте позже.' },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      recordAttempt(ip);
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      );
    }

    // Check credentials - HARDCODED FOR SIMPLICITY
    const ADMIN_USERNAME = 'hantagam_admin';
    const ADMIN_PASSWORD_HASH = '$2b$10$3U/3T8qYnx4.RIhkoYSSVOQ4RUV5IGSqGbAkbBn5Ot4sM4heHmba6';
    
    const isValidUsername = username === ADMIN_USERNAME;
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isValidUsername || !isValidPassword) {
      recordAttempt(ip);
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    // Clear rate limit on successful login
    loginAttempts.delete(ip);

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-chars-long-12345');
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
