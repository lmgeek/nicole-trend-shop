import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentMethod } from '@/lib/models/PaymentMethod';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const method = await PaymentMethod.findById(params.id);
    if (!method) return NextResponse.json({ error: 'Metodo di pagamento non trovato' }, { status: 404 });
    return NextResponse.json(method);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const data = await request.json();
    const method = await PaymentMethod.findByIdAndUpdate(params.id, data, { new: true });
    if (!method) return NextResponse.json({ error: 'Metodo di pagamento non trovato' }, { status: 404 });
    return NextResponse.json(method);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const method = await PaymentMethod.findByIdAndDelete(params.id);
    if (!method) return NextResponse.json({ error: 'Metodo di pagamento non trovato' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
