import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todos os vencedores
    const winners = await prisma.winner.findMany({
      orderBy: {
        prizeDate: 'desc',
      },
    });

    return NextResponse.json(winners);
  } catch (error) {
    console.error("Erro ao buscar vencedores:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}