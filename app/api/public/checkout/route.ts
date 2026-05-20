import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Sale } from '@/lib/models/Sale';
import { Product } from '@/lib/models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const { items, customer, paymentMethod, shippingAddress, total } = data;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Il carrello è vuoto' }, { status: 400 });
    }

    const products = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Prodotto non trovato: ${item.productId}` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insufficiente per ${product.name}` }, { status: 400 });
      }

      products.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      calculatedTotal += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json({ error: 'Il totale non corrisponde' }, { status: 400 });
    }

    const sale = await Sale.create({
      clientName: customer?.name || 'Cliente ospite',
      clientEmail: customer?.email || '',
      clientPhone: customer?.phone || '',
      products,
      total: calculatedTotal,
      paymentMethod,
      shippingAddress,
      status: 'pending',
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
