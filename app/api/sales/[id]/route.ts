import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Sale } from '@/lib/models/Sale';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const sale = await Sale.findById(id).populate('client', 'name email');
    if (!sale) return NextResponse.json({ error: 'Vendita non trovata' }, { status: 404 });
    return NextResponse.json(sale);
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
    const sale = await Sale.findByIdAndUpdate(id, data, { new: true });
    if (!sale) return NextResponse.json({ error: 'Vendita non trovata' }, { status: 404 });
    return NextResponse.json(sale);
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
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) return NextResponse.json({ error: 'Vendita non trovata' }, { status: 404 });
    return NextResponse.json({ message: 'Vendita eliminata' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
