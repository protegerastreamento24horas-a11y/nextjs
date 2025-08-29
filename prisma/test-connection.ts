import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Testar conexão com o banco de dados
    const raffleConfig = await prisma.raffleConfig.findFirst();
    console.log('Conexão com o banco de dados bem-sucedida!');
    
    if (raffleConfig) {
      console.log('Configuração da rifa encontrada:', raffleConfig);
    } else {
      console.log('Nenhuma configuração de rifa encontrada.');
    }
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();