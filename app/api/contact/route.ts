import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nome, email e messaggio sono obbligatori' }, { status: 400 });
    }

    await sendContactEmail({ name, email, phone: phone || '', message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Errore nell\'invio del messaggio' }, { status: 500 });
  }
}
