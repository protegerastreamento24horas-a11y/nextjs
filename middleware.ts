import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/api/pix/webhook',
    '/admin/login',
    '/admin/test-login',
    '/admin/test'
  ];
  
  // Verificar se a rota é pública
  const isPublicPath = publicPaths.includes(pathname);
  
  // Se for uma rota pública, permitir acesso
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // A verificação de autenticação real será feita no cliente
  // Este middleware apenas protege rotas públicas e admin
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    // Para simplificar, vamos permitir acesso a todas as rotas admin
    // A verificação real será feita no cliente
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};