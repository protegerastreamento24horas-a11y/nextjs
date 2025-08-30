import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testando conexão com o banco de dados...');
    
    // Testar a conexão
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Testar consulta à tabela RaffleConfig
    const raffleConfigs = await prisma.raffleConfig.findMany();
    console.log(`✅ Encontradas ${raffleConfigs.length} configurações de rifa`);
    
    // Testar consulta à tabela Prize
    const prizes = await prisma.prize.findMany();
    console.log(`✅ Encontrados ${prizes.length} prêmios`);
    
    // Testar consulta à tabela Ticket (sem acessar raffleConfigId)
    const tickets = await prisma.ticket.findMany();
    console.log(`✅ Encontrados ${tickets.length} tickets`);
    
    // Testar consulta à tabela Winner
    const winners = await prisma.winner.findMany();
    console.log(`✅ Encontrados ${winners.length} vencedores`);
    
    console.log('✅ Todos os testes de conexão e consultas foram bem-sucedidos!');
  } catch (error) {
    console.error('❌ Erro ao testar conexão com o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();