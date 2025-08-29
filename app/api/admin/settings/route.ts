import { NextResponse } from 'next/server';

// Em uma implementação real, isso seria salvo em um banco de dados
let currentWinningChance = parseInt(process.env.WINNING_CHANCE || '100');

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { winningChance } = body;

    // Validar entrada
    if (!winningChance || winningChance < 1) {
      return NextResponse.json(
        { error: "Chance de vitória inválida" },
        { status: 400 }
      );
    }

    // Atualizar a chance de vitória (em uma implementação real, salvaria no banco)
    currentWinningChance = winningChance;

    return NextResponse.json({ 
      message: `Chance de vitória atualizada para 1 em ${winningChance}`,
      winningChance
    });
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ winningChance: currentWinningChance });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}