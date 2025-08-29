import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { winningChance } = body;

    // Em uma implementação real, isso seria salvo no banco de dados ou em um arquivo de configuração
    // Para esta demonstração, vamos apenas retornar sucesso
    
    // Se estivéssemos usando um arquivo de configuração, poderíamos atualizá-lo aqui
    // Ou se estivéssemos usando variáveis de ambiente, poderíamos atualizá-las
    
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
    // Em uma implementação real, isso viria do banco de dados ou de um arquivo de configuração
    const winningChance = parseInt(process.env.WINNING_CHANCE || '100');
    
    return NextResponse.json({ winningChance });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}