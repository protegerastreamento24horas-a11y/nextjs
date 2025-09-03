import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('=== MIDDLEWARE EXECUTANDO ===');
  console.log('Path:', pathname);
  console.log('URL completa:', request.url);
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/api/pix/webhook',
    '/admin/login',
    '/admin/test-login'
  ];
  
  // Verificar se a rota é pública
  const isPublicPath = publicPaths.includes(pathname);
  
  console.log('É rota pública?', isPublicPath);
  
  // Se for uma rota pública, permitir acesso
  if (isPublicPath) {
    console.log('Permitindo acesso a rota pública');
    return NextResponse.next();
  }
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    console.log('Protegendo rota administrativa');
    
    // Verificar token de autenticação
    const token = request.cookies.get('admin_token')?.value;
    
    console.log('Token no cookie:', token ? token.substring(0, 20) + '...' : 'NENHUM');
    
    // Se não tem token, redirecionar para login
    if (!token) {
      console.log('SEM TOKEN - Redirecionando para login');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      loginUrl.searchParams.set('error', 'no_token');
      return NextResponse.redirect(loginUrl);
    }
    
    // Se tem token, permitir acesso (por enquanto, sem verificar a validade)
    console.log('COM TOKEN - Permitindo acesso');
    return NextResponse.next();
  }
  
  console.log('Permitindo acesso a rota não administrativa');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};