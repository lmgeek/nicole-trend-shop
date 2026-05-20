import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

const COOKIE_NAME = 'nicole_auth';

export async function POST(request: NextRequest) {
  console.log('[LOGIN] POST received');
  try {
    await connectDB();
    const body = await request.json();
    console.log('[LOGIN] Body:', { email: body.email, hasPassword: !!body.password });

    const { email, password } = body;

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return NextResponse.json({ error: 'Email e password sono obbligatori' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[LOGIN] User not found for email:', email);
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }
    console.log('[LOGIN] User found:', user.email);

    const isValid = await comparePassword(password, user.password);
    console.log('[LOGIN] Password valid:', isValid);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const userData = { id: user._id, name: user.name, email: user.email, role: user.role };
    console.log('[LOGIN] Token generated');

    const response = NextResponse.json({ user: userData });
    response.cookies.set(COOKIE_NAME, JSON.stringify({ token, user: userData }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    console.log('[LOGIN] Cookie set, returning success');
    return response;
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
