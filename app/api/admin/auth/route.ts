import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Em uma implementação real, essas credenciais viriam de variáveis de ambiente ou banco de dados
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validar credenciais
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar credenciais (em produção, use bcrypt ou outro método seguro)
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Gerar token JWT
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'super-secret-jwt-key'
      );
      
      const alg = 'HS256';
      
      const jwt = await new jose.SignJWT({ username, role: 'admin' })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Criar resposta com token
      const response = NextResponse.json({
        token: jwt,
        user: {
          username,
          role: 'admin'
        }
      });
      
      // Definir cookie com token
      response.cookies.set('admin_token', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 horas
        path: '/',
        sameSite: 'strict'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}