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
    const { 
      ticketPrice, 
      prizeValue, 
      maxNumber, 
      winningNumbers, 
      autoDrawnNumbers, 
      winningProbability 
    } = body;

    // Validar dados
    if (
      ticketPrice === undefined || 
      prizeValue === undefined || 
      maxNumber === undefined || 
      !winningNumbers || 
      autoDrawnNumbers === undefined || 
      winningProbability === undefined
    ) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
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

    // Validar probabilidade (0-100)
    const probability = parseInt(winningProbability);
    if (probability < 0 || probability > 100) {
      return NextResponse.json(
        { error: 'A probabilidade deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    // Validar quantidade de números sorteados automaticamente
    const autoNumbers = parseInt(autoDrawnNumbers);
    if (autoNumbers < 1) {
      return NextResponse.json(
        { error: 'A quantidade de números sorteados deve ser pelo menos 1' },
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
          prizeValue: parseFloat(prizeValue),
          maxNumber: parseInt(maxNumber),
          winningNumbers: validNumbers.join(','),
          autoDrawnNumbers: autoNumbers,
          winningProbability: probability
        }
      });
    } else {
      // Criar nova configuração
      raffleConfig = await prisma.raffleConfig.create({
        data: {
          ticketPrice: parseFloat(ticketPrice),
          prizeValue: parseFloat(prizeValue),
          maxNumber: parseInt(maxNumber),
          winningNumbers: validNumbers.join(','),
          autoDrawnNumbers: autoNumbers,
          winningProbability: probability,
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