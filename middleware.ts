import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/admin/login'
  ];
  
  // Verificar se a rota é pública
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin') && !isPublicPath) {
    // Verificar token de autenticação
    const authHeader = request.headers.get('authorization');
    const token = request.cookies.get('admin_token')?.value;
    
    // Se não tem token no header, verificar no cookie
    const authToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : token;
    
    if (!authToken) {
      // Redirecionar para login se for acesso via navegador
      if (pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }
    
    // Verificar token JWT
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'super-secret-jwt-key'
      );
      
      await jose.jwtVerify(authToken, secret);
      
      // Se for uma requisição para a API, continuar
      if (pathname.startsWith('/api/admin')) {
        // Adicionar o token ao header para as APIs
        const response = NextResponse.next();
        response.headers.set('authorization', `Bearer ${authToken}`);
        return response;
      }
      
      // Se for acesso ao painel web, continuar
      const response = NextResponse.next();
      // Atualizar cookie com token válido
      response.cookies.set('admin_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 horas
        path: '/',
        sameSite: 'strict'
      });
      return response;
    } catch (error) {
      // Token inválido, redirecionar para login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};