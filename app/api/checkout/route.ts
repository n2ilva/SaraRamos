import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2023-10-16' as any, // Cast to any to avoid strict version checking conflicts
});

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  type: string;
  imageUrl?: string;
}

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CheckoutItem) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.title,
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              id: item.id,
              type: item.type
            }
          },
          unit_amount: item.price, // Price in cents
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/pages/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pages/checkout/cancelado`,
      customer_email: email,
      metadata: {
        items: JSON.stringify(items.map((i: CheckoutItem) => ({ id: i.id, type: i.type }))).slice(0, 500) // Truncate if too long for metadata
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error creating checkout session' }, 
      { status: 500 }
    );
  }
}
