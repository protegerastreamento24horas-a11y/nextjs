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
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    // Verificar apenas a existência do cookie admin_token
    const hasToken = request.cookies.has('admin_token');
    
    // Se não tem token, redirecionar para login
    if (!hasToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      loginUrl.searchParams.set('error', 'no_token');
      return NextResponse.redirect(loginUrl);
    }
    
    // Se tem token, permitir acesso
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};