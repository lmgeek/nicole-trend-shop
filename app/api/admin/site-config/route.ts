import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteConfig } from '@/lib/models/SiteConfig';

export async function GET() {
  try {
    await connectDB();
    const configs = await SiteConfig.find();
    const result: Record<string, any> = {};
    for (const c of configs) {
      result[c.key] = c.value;
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await SiteConfig.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
