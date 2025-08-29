import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obter configuração atual da rifa
export async function GET() {
  try {
    const raffleConfig = await prisma.raffleConfig.findFirst({
      where: { isActive: true }
    });

    if (!raffleConfig) {
      return NextResponse.json({ error: 'Configuração da rifa não encontrada' }, { status: 404 });
    }

    return NextResponse.json(raffleConfig);
  } catch (error) {
    console.error("Erro ao buscar configuração da rifa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Atualizar configuração da rifa
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ticketPrice, maxNumber, winningNumbers } = body;

    // Validar dados
    if (ticketPrice === undefined || maxNumber === undefined || !winningNumbers) {
      return NextResponse.json(
        { error: 'Preço do bilhete, número máximo e números premiados são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato dos números premiados
    const numbersArray = winningNumbers.split(',').map((num: string) => num.trim());
    const validNumbers = numbersArray.filter((num: string) => !isNaN(parseInt(num)) && parseInt(num) > 0 && parseInt(num) <= maxNumber);
    
    if (validNumbers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum número premiado válido fornecido' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma configuração ativa
    let raffleConfig = await prisma.raffleConfig.findFirst({
      where: { isActive: true }
    });

    if (raffleConfig) {
      // Atualizar configuração existente
      raffleConfig = await prisma.raffleConfig.update({
        where: { id: raffleConfig.id },
        data: {
          ticketPrice: parseFloat(ticketPrice),
          maxNumber: parseInt(maxNumber),
          winningNumbers: validNumbers.join(',')
        }
      });
    } else {
      // Criar nova configuração
      raffleConfig = await prisma.raffleConfig.create({
        data: {
          ticketPrice: parseFloat(ticketPrice),
          maxNumber: parseInt(maxNumber),
          winningNumbers: validNumbers.join(','),
          isActive: true
        }
      });
    }

    return NextResponse.json(raffleConfig);
  } catch (error) {
    console.error("Erro ao atualizar configuração da rifa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}