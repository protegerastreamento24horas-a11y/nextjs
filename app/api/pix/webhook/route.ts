import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWinnerEmail } from '@/app/lib/emailService';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook HorsePay recebido:', body);
    
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
          // Obter configuração da rifa
          const raffleConfig = await prisma.raffleConfig.findFirst({
            where: { isActive: true }
          });

          if (!raffleConfig) {
            throw new Error('Configuração da rifa não encontrada');
          }

          // Atualizar status do pagamento
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { isWinner: false } // Status temporário, será atualizado após sorteio
          });

          // Verificar probabilidade de ganhar
          const probabilityCheck = Math.floor(Math.random() * 100) + 1; // 1-100
          const isWinnerByProbability = probabilityCheck <= raffleConfig.winningProbability;

          // Se a probabilidade for 0, nunca ganha
          if (raffleConfig.winningProbability === 0) {
            // Não há chance de ganhar
            console.log(`Bilhete ${ticket.id} pago, mas sem chance de ganhar.`);
            return NextResponse.json({ success: true });
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

          // Verificar se o número sorteado está entre os números premiados
          const winningNumbersArray = raffleConfig.winningNumbers.split(',').map(num => parseInt(num.trim()));
          const isWinner = isWinnerByProbability && winningNumbersArray.some(num => drawnNumbers.includes(num));

          // Atualizar status de vencedor
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { isWinner }
          });

          // Se for vencedor, criar registro na tabela Winner
          if (isWinner) {
            const prize = await prisma.prize.findFirst({
              where: { isActive: true },
              orderBy: { rarity: 'desc' }
            });

            await prisma.winner.create({
              data: {
                ticketId: ticket.id,
                userName: ticket.userName,
                userEmail: ticket.userEmail,
                drawnNumbers: drawnNumbers.join(','),
                prizeId: prize?.id
              }
            });

            // Enviar e-mail para o vencedor (se tiver e-mail)
            if (ticket.userEmail) {
              await sendWinnerEmail(ticket.userEmail, ticket.userName, prize);
            }
            
            console.log(`Bilhete ${ticket.id} é vencedor!`);
          } else {
            console.log(`Bilhete ${ticket.id} pago, mas não foi sorteado.`);
          }

          return NextResponse.json({ success: true });
        } else {
          // Pagamento não confirmado
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { isWinner: false }
          });
          
          console.log(`Pagamento do bilhete ${ticket.id} não confirmado.`);
          return NextResponse.json({ success: true });
        }
      } else {
        console.log(`Bilhete com external_id ${body.external_id} não encontrado.`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar webhook HorsePay:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}