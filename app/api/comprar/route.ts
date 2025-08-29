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
          maxNumber: 10000,  // Sorteio entre 1 e 10.000
          winningNumbers: "100,88,14" // Números premiados padrão
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

    // Realizar sorteio automático
    const drawnNumber = Math.floor(Math.random() * raffleConfig.maxNumber) + 1;
    
    // Atualizar bilhete com o número sorteado
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { drawnNumber }
    });

    // Verificar se o número sorteado é premiado
    const winningNumbers = raffleConfig.winningNumbers
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    
    const isWinner = winningNumbers.includes(drawnNumber);

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
            drawnNumber: drawnNumber,
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
            drawnNumber: drawnNumber
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
        drawnNumber,
        message: `Parabéns, você ganhou ${prizeName}! Seu número sorteado foi ${drawnNumber}. Entre em contato conosco para receber seu prêmio.`,
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
        drawnNumber,
        message: `Seu número sorteado foi ${drawnNumber}. Não foi dessa vez. Tente novamente!`,
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
      drawnNumber: winner.drawnNumber
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