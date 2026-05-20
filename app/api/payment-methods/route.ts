import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentMethod } from '@/lib/models/PaymentMethod';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const methods = await PaymentMethod.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json(methods);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    await connectDB();
    const data = await request.json();
    const method = await PaymentMethod.create(data);
    return NextResponse.json(method, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
