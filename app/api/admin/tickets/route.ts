import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

// Função reutilizável para verificar o token JWT
async function verifyToken(token: string): Promise<boolean> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only'
  );

  try {
    await jose.jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    // Verificar token de autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verificar token JWT
    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Buscar todos os bilhetes
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Erro ao buscar bilhetes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}