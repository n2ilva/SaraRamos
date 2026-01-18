import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  // Protege contra Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Previne MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Protege a navegação via HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  // Controla quanto de informação de referência é passado
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Controle básico de DNS
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: '/:path*',
};
