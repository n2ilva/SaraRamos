'use client';

import { loadStripe } from '@stripe/stripe-js';

// Stripe public key - safe to expose in client
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number; // in cents (BRL)
  type: 'livro' | 'video' | 'jogo' | 'atividade' | 'pacote';
  // Optional: Stripe Price ID if you've created the product in Stripe Dashboard
  stripePriceId?: string;
  // Optional: Stripe Payment Link if using Payment Links
  stripePaymentLink?: string;
}

// Helper to format price in BRL
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceInCents / 100);
}

// Redirect to Stripe Payment Link
export function redirectToPaymentLink(paymentLink: string, email?: string): void {
  let url = paymentLink;
  
  // Pre-fill customer email if provided
  if (email) {
    const separator = paymentLink.includes('?') ? '&' : '?';
    url = `${paymentLink}${separator}prefilled_email=${encodeURIComponent(email)}`;
  }
  
  window.location.href = url;
}

// Get Stripe instance (for future use with Elements if needed)
export { stripePromise };
