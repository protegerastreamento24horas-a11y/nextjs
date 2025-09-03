import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware executando para:', pathname);
  
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
    return NextResponse.next();
  }
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin')) {
    // Verificar token de autenticação
    const token = request.cookies.get('admin_token')?.value;
    
    console.log('Token encontrado no cookie:', !!token);
    
    // Se não tem token, redirecionar para login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      loginUrl.searchParams.set('error', 'no_token');
      console.log('Redirecionando para login por falta de token');
      return NextResponse.redirect(loginUrl);
    }
    
    // Se tem token, permitir acesso (por enquanto, sem verificar a validade)
    console.log('Permitindo acesso - token encontrado');
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};