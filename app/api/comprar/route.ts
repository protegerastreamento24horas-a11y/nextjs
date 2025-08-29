import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWinnerEmail } from '@/app/lib/emailService';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail } = body;
    
    // Obter informações de rastreamento
    const ip = request.headers.get('x-forwarded-for') || 'IP desconhecido';
    const userAgent = request.headers.get('user-agent') || 'User agent desconhecido';

    // Validar dados
    if (!userName) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Obter configuração da rifa
    let raffleConfig = await prisma.raffleConfig.findFirst({
      where: { isActive: true }
    });

    // Se não houver configuração, criar uma padrão
    if (!raffleConfig) {
      raffleConfig = await prisma.raffleConfig.create({
        data: {
          ticketPrice: 1000, // R$ 1.000,00
          prizeValue: 10000, // R$ 10.000,00
          maxNumber: 10000,  // Sorteio entre 1 e 10.000
          winningNumbers: "100,88,14", // Números premiados padrão
          autoDrawnNumbers: 1, // 1 número sorteado automaticamente
          winningProbability: 100 // 100% de probabilidade
        }
      });
    }

    // Criar o bilhete
    const ticket = await prisma.ticket.create({
      data: {
        userName,
        userEmail: userEmail || null,
        ip,
        userAgent,
      },
    });

    // Verificar probabilidade de ganhar
    const probabilityCheck = Math.floor(Math.random() * 100) + 1; // 1-100
    const isWinnerByProbability = probabilityCheck <= raffleConfig.winningProbability;

    // Se a probabilidade for 0, nunca ganha
    if (raffleConfig.winningProbability === 0) {
      // Não há chance de ganhar
      return NextResponse.json({
        isWinner: false,
        drawnNumbers: [],
        message: `Seu bilhete foi registrado, mas infelizmente não foi dessa vez. Tente novamente!`,
      });
    }

    // Sortear números automaticamente
    const drawnNumbers = [];
    for (let i = 0; i < raffleConfig.autoDrawnNumbers; i++) {
      const drawnNumber = Math.floor(Math.random() * raffleConfig.maxNumber) + 1;
      drawnNumbers.push(drawnNumber);
    }
    
    // Atualizar bilhete com os números sorteados
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { drawnNumbers: drawnNumbers.join(',') }
    });

    // Verificar se algum número sorteado é premiado (somente se passar na probabilidade)
    const winningNumbers = raffleConfig.winningNumbers
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    
    const hasWinningNumber = drawnNumbers.some(num => winningNumbers.includes(num));
    const isWinner = isWinnerByProbability && hasWinningNumber;

    // Se for vencedor, registrar na tabela de vencedores
    if (isWinner) {
      // Selecionar um prêmio aleatório entre os ativos
      const activePrizes = await prisma.prize.findMany({
        where: { isActive: true }
      });
      
      let prize = null;
      if (activePrizes.length > 0) {
        // Selecionar um prêmio aleatório
        const randomIndex = Math.floor(Math.random() * activePrizes.length);
        prize = activePrizes[randomIndex];
        
        // Associar o prêmio ao bilhete
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { 
            isWinner: true,
            prizeId: prize.id
          },
        });
        
        // Registrar na tabela de vencedores
        await prisma.winner.create({
          data: {
            ticketId: ticket.id,
            userName: ticket.userName,
            userEmail: ticket.userEmail,
            drawnNumbers: drawnNumbers.join(','),
            prizeId: prize.id
          },
        });
      } else {
        // Caso não haja prêmios ativos, apenas marcar como vencedor
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { isWinner: true },
        });
        
        await prisma.winner.create({
          data: {
            ticketId: ticket.id,
            userName: ticket.userName,
            userEmail: ticket.userEmail,
            drawnNumbers: drawnNumbers.join(',')
          },
        });
      }

      // Enviar e-mail para o vencedor (se tiver e-mail)
      if (userEmail) {
        const prizeName = prize ? prize.name : "Prêmio Especial da Rifa";
        await sendWinnerEmail({
          userName,
          userEmail,
          prizeName
        });
      }

      const prizeName = prize ? prize.name : "um prêmio especial";
      return NextResponse.json({
        isWinner: true,
        drawnNumbers,
        message: `Parabéns, você ganhou ${prizeName}! Seus números sorteados foram ${drawnNumbers.join(', ')}. Entre em contato conosco para receber seu prêmio.`,
        prize: prize ? {
          id: prize.id,
          name: prize.name,
          description: prize.description,
          value: prize.value
        } : null
      });
    } else {
      return NextResponse.json({
        isWinner: false,
        drawnNumbers,
        message: `Seus números sorteados foram ${drawnNumbers.join(', ')}. Não foi dessa vez. Tente novamente!`,
      });
    }
  } catch (error) {
    console.error("Erro ao comprar bilhete:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Buscar os últimos 3 vencedores com informações do prêmio
    const winners = await prisma.winner.findMany({
      orderBy: {
        prizeDate: 'desc',
      },
      take: 3,
      include: {
        prize: true,
        ticket: true
      }
    });

    // Formatar os dados para o frontend
    const formattedWinners = winners.map(winner => ({
      userName: winner.userName,
      prizeDate: winner.prizeDate,
      prizeName: winner.prize?.name || "Prêmio Especial",
      ticketId: winner.ticketId,
      drawnNumbers: winner.drawnNumbers
    }));

    return NextResponse.json(formattedWinners);
  } catch (error) {
    console.error("Erro ao buscar vencedores:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}