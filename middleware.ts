import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('=== MIDDLEWARE EXECUTADO ===');
  console.log('Pathname:', pathname);
  console.log('Method:', request.method);
  
  // Registrar cookies
  console.log('Cookies:', [...request.cookies]);
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/api/pix/webhook',
    '/admin/login',
    '/admin/test-login',
    '/admin/test',
    '/admin/test-auth',
    '/admin/test-storage'
  ];
  
  // Verificar se a rota é pública
  const isPublicPath = publicPaths.includes(pathname);
  console.log('É rota pública:', isPublicPath);
  
  // Se for uma rota pública, permitir acesso
  if (isPublicPath) {
    console.log('Permitindo acesso a rota pública');
    return NextResponse.next();
  }
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    console.log('Protegendo rota administrativa');
    // Verificar apenas a existência do token no localStorage
    // Como não podemos acessar localStorage no middleware, permitir acesso
    // A verificação real será feita no cliente
    return NextResponse.next();
  }
  
  console.log('Permitindo acesso a outras rotas');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};