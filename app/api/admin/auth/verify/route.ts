import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

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