import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obter todos os prêmios
export async function GET() {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(prizes);
  } catch (error) {
    console.error("Erro ao buscar prêmios:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Criar um novo prêmio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, value, rarity, isActive } = body;

    // Validar dados obrigatórios
    if (!name || !description || !value) {
      return NextResponse.json(
        { error: "Nome, descrição e valor são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar raridade
    if (rarity && (rarity < 1 || rarity > 5)) {
      return NextResponse.json(
        { error: "Raridade deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    const prize = await prisma.prize.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        value: parseFloat(value),
        rarity: rarity || 1,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(prize);
  } catch (error) {
    console.error("Erro ao criar prêmio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}