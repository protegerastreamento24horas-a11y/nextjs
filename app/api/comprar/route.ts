import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWinnerEmail } from '@/app/lib/emailService';
import HorsePayService from '@/app/lib/horsepayService';

const prisma = new PrismaClient();
const horsepay = new HorsePayService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail, ticketPrice } = body;
    
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

    // Criar o bilhete temporariamente (ainda não confirmado)
    const ticket = await prisma.ticket.create({
      data: {
        userName,
        userEmail: userEmail || null,
        ip,
        userAgent,
      },
    });

    // Criar pedido na HorsePay
    const order = await horsepay.createOrder(
      userName,
      ticketPrice || raffleConfig.ticketPrice,
      [
        {
          user: "admin",
          percent: 100
        }
      ]
    );

    // Atualizar bilhete com o ID do pedido
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        drawnNumbers: order.external_id.toString(),
        // O status do pagamento será atualizado via webhook
      }
    });

    // Retornar informações do pedido para exibição no frontend
    return NextResponse.json({
      ticketId: ticket.id,
      qrCode: order.payment, // Base64 da imagem do QR Code
      copyPaste: order.copy_past, // Código PIX copia e cola
      externalId: order.external_id,
      message: "Pedido criado com sucesso. Efetue o pagamento via PIX para confirmar sua participação."
    });

  } catch (error: any) {
    console.error("Erro ao processar compra:", error);
    
    // Se um bilhete foi criado mas houve erro posterior, remover o bilhete
    if (error.ticketId) {
      await prisma.ticket.delete({
        where: { id: error.ticketId }
      });
    }
    
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para receber webhooks da HorsePay
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar se é um callback de pagamento
    if (body.external_id && body.status !== undefined) {
      // Atualizar status do bilhete com base no callback
      const ticket = await prisma.ticket.findFirst({
        where: { 
          drawnNumbers: body.external_id.toString()
        }
      });

      if (ticket) {
        // Se o pagamento foi confirmado (status = 1)
        if (body.status === 1) {
          // Atualizar bilhete como pago
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { 
              purchaseDate: new Date()
            }
          });

          // Verificar se o usuário ganhou
          // Esta é uma implementação simplificada - em produção, seria mais complexa
          const isWinner = Math.random() * 100 < 10; // 10% de chance de ganhar
          
          if (isWinner) {
            // Selecionar um prêmio aleatório
            const prizes = await prisma.prize.findMany({
              where: { isActive: true }
            });
            
            if (prizes.length > 0) {
              const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
              
              // Atualizar bilhete como vencedor
              await prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                  isWinner: true,
                  prizeId: randomPrize.id
                }
              });
              
              // Criar registro de vencedor
              const winner = await prisma.winner.create({
                data: {
                  ticketId: ticket.id,
                  userName: ticket.userName,
                  userEmail: ticket.userEmail,
                  drawnNumbers: ticket.drawnNumbers || '',
                  prizeId: randomPrize.id
                }
              });
              
              // Enviar e-mail para o vencedor (se tiver e-mail)
              if (ticket.userEmail) {
                await sendWinnerEmail({
                  userName: ticket.userName,
                  userEmail: ticket.userEmail,
                  prizeName: randomPrize.name
                });
              }
            }
          }
        } else if (body.status === 2) {
          // Pagamento falhou - remover o bilhete
          await prisma.ticket.delete({
            where: { id: ticket.id }
          });
        }
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Obter vencedores (usado na página principal)
export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      orderBy: {
        prizeDate: 'desc'
      },
      take: 10, // Últimos 10 vencedores
      include: {
        prize: true
      }
    });

    const formattedWinners = winners.map(winner => ({
      userName: winner.userName,
      prizeDate: winner.prizeDate.toISOString(),
      prizeName: winner.prize?.name || 'Prêmio não identificado',
      drawnNumbers: winner.drawnNumbers
    }));

    return NextResponse.json(formattedWinners);
  } catch (error) {
    console.error("Erro ao buscar vencedores:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}