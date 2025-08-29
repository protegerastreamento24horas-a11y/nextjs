const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    
    // Testar uma consulta simples
    const configs = await prisma.raffleConfig.findMany();
    console.log('✅ Consulta ao banco de dados bem-sucedida!');
    console.log(`Encontradas ${configs.length} configurações de rifa`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
  }
}

testConnection();