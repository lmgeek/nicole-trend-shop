import { NextResponse } from 'next/server';
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
