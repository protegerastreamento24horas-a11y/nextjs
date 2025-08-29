import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Testar a conexão executando uma consulta simples
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Tentar buscar a configuração da rifa
    const raffleConfig = await prisma.raffleConfig.findFirst();
    if (raffleConfig) {
      console.log('✅ Configuração da rifa encontrada:', raffleConfig);
    } else {
      console.log('ℹ️ Nenhuma configuração de rifa encontrada');
    }
    
    // Tentar buscar alguns prêmios
    const prizes = await prisma.prize.findMany({ take: 5 });
    console.log(`✅ ${prizes.length} prêmios encontrados`);
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();