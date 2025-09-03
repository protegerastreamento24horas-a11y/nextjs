import { NextResponse } from 'next/server';

// Simulação de armazenamento em memória (em produção, usar um banco de dados real)
let tickets: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail, ticketCount } = body;

    // Validar dados
    if (!userName || !userEmail || !ticketCount) {
      return NextResponse.json(
        { error: 'Nome, email e quantidade de bilhetes são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar IDs únicos para os bilhetes
    const newTickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticketId = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const ticket = {
        id: ticketId,
        userName,
        userEmail,
        purchaseDate: new Date().toISOString(),
        isWinner: false,
        drawnNumbers: null,
      };
      tickets.push(ticket);
      newTickets.push(ticket);
    }

    // Em uma implementação real, aqui você integraria com o sistema de pagamento
    // e geraria um QR Code PIX para pagamento

    return NextResponse.json({
      success: true,
      message: 'Bilhetes reservados com sucesso',
      ticketId: newTickets[0].id,
      tickets: newTickets,
      totalAmount: ticketCount * 10, // R$ 10,00 por bilhete
      // Em uma implementação real, você retornaria os dados para pagamento PIX
      paymentInfo: {
        qrCode: 'SIMULACAO_QR_CODE',
        copyPaste: 'SIMULACAO_CODIGO_COPIA_E_COLA',
      }
    });
  } catch (error) {
    console.error('Erro ao processar compra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obter bilhetes (para administração)
export async function GET() {
  return NextResponse.json(tickets);
}