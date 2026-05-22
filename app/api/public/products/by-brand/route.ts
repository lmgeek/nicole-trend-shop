import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    if (!brand) {
      return NextResponse.json({ error: 'Marca no especificada' }, { status: 400 });
    }

    const products = await Product.find({ brand: brand });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products by brand:', error);
    return NextResponse.json([], { status: 200 });
  }
}
