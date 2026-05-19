import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Client } from '@/lib/models/Client';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const client = await Client.findById(id);
    if (!client) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 });
    return NextResponse.json(client);
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
    const client = await Client.findByIdAndUpdate(id, data, { new: true });
    if (!client) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 });
    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 });
    return NextResponse.json({ message: 'Cliente eliminato' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
