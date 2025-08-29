import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWinnerEmail } from '@/app/lib/emailService';

const prisma = new PrismaClient();

// Chance de vitória: 1 em 100 (1%)
// Esta chance pode ser configurada via variável de ambiente
let WINNING_CHANCE = parseInt(process.env.WINNING_CHANCE || '100');

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
    const randomNumber = Math.floor(Math.random() * WINNING_CHANCE) + 1;
    const isWinner = randomNumber === 1;

    // Se for vencedor, registrar na tabela de vencedores
    if (isWinner) {
      await prisma.winner.create({
        data: {
          ticketId: ticket.id,
          userName: ticket.userName,
          userEmail: ticket.userEmail,
        },
      });

      // Atualizar o bilhete como vencedor
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { isWinner: true },
      });

      // Enviar e-mail para o vencedor (se tiver e-mail)
      if (userEmail) {
        await sendWinnerEmail({
          userName,
          userEmail,
          prizeName: "Prêmio Especial da Rifa"
        });
      }

      return NextResponse.json({
        isWinner: true,
        message: "Parabéns, você ganhou! Entre em contato conosco para receber seu prêmio.",
      });
    } else {
      return NextResponse.json({
        isWinner: false,
        message: "Não foi dessa vez. Tente novamente!",
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
    // Buscar os últimos 3 vencedores
    const winners = await prisma.winner.findMany({
      orderBy: {
        prizeDate: 'desc',
      },
      take: 3,
      select: {
        userName: true,
        prizeDate: true,
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