import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentMethod } from '@/lib/models/PaymentMethod';

export async function GET() {
  try {
    await connectDB();
    const methods = await PaymentMethod.find({ enabled: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(methods);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
