import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Tentar obter token de múltiplos locais
    let token: string | undefined;
    
    // 1. Verificar header Authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. Se não encontrou no header, verificar cookies do request
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookieMatch = cookieHeader.match(/admin_token=([^;]+)/);
        if (cookieMatch) {
          token = cookieMatch[1];
        }
      }
    }
    
    // 3. Se ainda não encontrou, verificar cookies do servidor (se disponível)
    if (!token) {
      const cookieStore = cookies();
      const tokenCookie = cookieStore.get('admin_token');
      token = tokenCookie?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only'
    );

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      
      return NextResponse.json({
        user: {
          username: payload.username,
          role: payload.role
        }
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}