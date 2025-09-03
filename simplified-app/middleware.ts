import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware simples para proteger rotas administrativas
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Para esta versão simplificada, permitimos acesso a todas as rotas
  // Em produção, você pode adicionar autenticação real aqui
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};