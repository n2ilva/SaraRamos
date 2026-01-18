import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2024-06-20' as any,
});



export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const line_items = [];

    // Validar preços no banco de dados para segurança (Server-Side Validation)
    for (const item of items) {
       // Referência ao produto no Firestore
       const productRef = doc(db, 'products', item.id);
       const snapshot = await getDoc(productRef);

       if (snapshot.exists()) {
          const productData = snapshot.data();
          
          // Verifica se temos preço e titulo
          const price = productData.price;
          const title = productData.title || productData.name || 'Produto sem nome';

          if (typeof price === 'number') {
             // O preço no banco já está em centavos (inteiro), então usamos diretamente
             const unitAmount = Number(price);

             line_items.push({
                price_data: {
                  currency: 'brl',
                  product_data: {
                    name: title,
                    // images removido para segurança (evitar download)
                    metadata: {
                      id: item.id,
                      type: productData.type || item.type || 'product'
                    }
                  },
                  unit_amount: unitAmount,
                },
                quantity: 1,
             });
          }
       }
    }

    if (line_items.length === 0) {
       return NextResponse.json({ error: 'Nenhum item válido encontrado ou erro de validação de preço.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/pages/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pages/checkout/cancelado`,
      customer_email: email,
      metadata: {
        userId: email,
        orderType: 'web_checkout',
        totalItems: line_items.length.toString()
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
