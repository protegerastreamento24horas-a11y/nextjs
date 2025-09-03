import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
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