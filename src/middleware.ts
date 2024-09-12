import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = new Map<string, string>();

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    cookies.set(name.trim(), rest.join('=').trim());
  });

  const token = cookies.get('auth');

  if (!token) {
    // Redirect to login page if no token
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  try {
    // Verify the token
    jwt.verify(token, jwtSecret);
    // Continue with the request if token is valid
    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying token:', error);
    // Redirect to login page if token verification fails
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/'], // Adjust to match the correct routes
};
