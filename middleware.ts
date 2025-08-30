import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/admin/login',
    '/admin/test-login'
  ];
  
  // Verificar se a rota é pública
  const isPublicPath = publicPaths.includes(pathname);
  
  // Se for uma rota pública, permitir acesso
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    // Verificar token de autenticação
    const token = request.cookies.get('admin_token')?.value;
    
    // Se não tem token, redirecionar para login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Para simplificar, vamos apenas permitir o acesso
    // Em uma implementação real, você verificaria o token JWT aqui
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};