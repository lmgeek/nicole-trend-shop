import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const foundUser = await User.findById(id, '-password');
    if (!foundUser) return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    return NextResponse.json(foundUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    if (!updatedUser) return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
