import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

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
    // Verificar token no localStorage (não é possível no middleware)
    // Então vamos verificar o cookie admin_token
    const token = request.cookies.get('admin_token')?.value;
    
    // Se não tem token, redirecionar para login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      loginUrl.searchParams.set('error', 'no_token');
      return NextResponse.redirect(loginUrl);
    }
    
    // Verificar token JWT
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only'
      );
      
      await jose.jwtVerify(token, secret);
      
      // Token válido, permitir acesso
      return NextResponse.next();
    } catch (error) {
      // Token inválido, redirecionar para login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      loginUrl.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};