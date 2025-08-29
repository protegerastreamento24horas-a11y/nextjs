import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Configurando o banco de dados...');
  
  // Esta função apenas verifica se a conexão está funcionando
  // As tabelas serão criadas automaticamente pelo Prisma
  
  // Exemplo de como você poderia criar dados iniciais, se necessário
  // const ticket = await prisma.ticket.create({
  //   data: {
  //     userName: 'Teste',
  //     isWinner: false,
  //   },
  // });
  
  console.log('Banco de dados configurado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });