import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de IPs permitidos para acessar o painel administrativo
// Em produção, você deve usar autenticação real
const allowedIPs = [
  // Adicione IPs específicos aqui se necessário
  // '192.168.1.1',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Proteger rotas administrativas
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Em uma implementação real, você implementaria autenticação adequada
    // Por enquanto, vamos apenas registrar o acesso
    console.log(`Acesso à área administrativa: ${pathname}`);
    
    // Verificar IP (opcional)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'IP desconhecido';
    
    // Se quiser restringir por IP, descomente o código abaixo:
    /*
    if (allowedIPs.length > 0 && !allowedIPs.includes(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Acesso não autorizado' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    */
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};