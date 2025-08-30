import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import HorsePayService from '@/app/lib/horsepayService';
import { sendWinnerEmail } from '@/app/lib/emailService';

const prisma = new PrismaClient();
const horsepay = new HorsePayService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar se é um callback válido da HorsePay
    if (!horsepay.validateCallbackDeposit(body)) {
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    // Processar o callback com base no external_id e status
    const { external_id, status, amount } = body;
    
    // Encontrar o ticket associado ao pagamento
    const ticket = await prisma.ticket.findFirst({
      where: {
        drawnNumbers: external_id.toString()
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Se o pagamento foi confirmado (status = 1)
    if (status === 1) {
      // Atualizar data de compra
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          purchaseDate: new Date()
        }
      });

      // Obter configuração da rifa
      const raffleConfig = await prisma.raffleConfig.findFirst({
        where: { isActive: true }
      });

      if (raffleConfig) {
        // Verificar se o usuário ganhou com base na probabilidade configurada
        const isWinner = Math.random() * 100 < raffleConfig.winningProbability;
        
        if (isWinner) {
          // Verificar se os números sorteados são premiados
          const winningNumbers = raffleConfig.winningNumbers.split(',').map(Number);
          
          // Sortear números automaticamente
          const drawnNumbers: number[] = [];
          for (let i = 0; i < raffleConfig.autoDrawnNumbers; i++) {
            const drawnNumber = Math.floor(Math.random() * raffleConfig.maxNumber) + 1;
            drawnNumbers.push(drawnNumber);
          }
          
          // Verificar se algum número sorteado é premiado
          const hasWinningNumber = drawnNumbers.some(num => winningNumbers.includes(num));
          
          if (hasWinningNumber) {
            // Selecionar um prêmio aleatório
            const prizes = await prisma.prize.findMany({
              where: { isActive: true }
            });
            
            if (prizes.length > 0) {
              const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
              
              // Atualizar ticket como vencedor
              await prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                  isWinner: true,
                  prizeId: randomPrize.id,
                  selectedNumber: drawnNumbers[0] // Para compatibilidade com versões anteriores
                }
              });
              
              // Criar registro de vencedor
              await prisma.winner.create({
                data: {
                  ticketId: ticket.id,
                  userName: ticket.userName,
                  userEmail: ticket.userEmail,
                  drawnNumbers: drawnNumbers.join(','),
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
        }
      }
      
      return NextResponse.json({ success: true });
    } 
    // Se o pagamento falhou (status = 2)
    else if (status === 2) {
      // Remover o ticket
      await prisma.ticket.delete({
        where: { id: ticket.id }
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}