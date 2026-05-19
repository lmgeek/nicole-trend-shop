import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HeroSlide } from '@/lib/models/HeroSlide';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ enabled: true }).populate('product').sort({ order: 1 });
    return NextResponse.json(slides);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
