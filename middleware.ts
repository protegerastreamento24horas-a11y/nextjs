import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('=== MIDDLEWARE EXECUTADO ===');
  console.log('Pathname:', pathname);
  console.log('Method:', request.method);
  console.log('URL completa:', request.url);
  console.log('Protocolo:', request.nextUrl.protocol);
  console.log('Host:', request.nextUrl.host);
  console.log('Hostname:', request.nextUrl.hostname);
  console.log('Porta:', request.nextUrl.port);
  console.log('Origem:', request.nextUrl.origin);
  
  // Registrar headers
  console.log('Headers:');
  request.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });
  
  // Registrar cookies
  console.log('Cookies:');
  for (const [key, value] of request.cookies) {
    console.log(`  ${key}: ${value}`);
  }
  
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/',
    '/api/comprar',
    '/api/pix/webhook',
    '/admin/login',
    '/admin/test-login',
    '/admin/test',
    '/admin/test-auth',
    '/admin/test-storage',
    '/admin/test-middleware',
    '/admin/test-middleware-details',
    '/admin/test-network'
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