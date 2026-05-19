import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';

export async function GET() {
  try {
    await connectDB();
    const enabledCategories = await Category.find({ enabled: true }).select('slug');
    const categorySlugs = enabledCategories.map((c) => c.slug);
    const products = await Product.find({ category: { $in: categorySlugs }, isFeatured: true });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
