import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Verificar se já existe uma configuração ativa
  const existingConfig = await prisma.raffleConfig.findFirst({
    where: { isActive: true }
  });

  if (!existingConfig) {
    // Criar configuração inicial
    const raffleConfig = await prisma.raffleConfig.create({
      data: {
        ticketPrice: 1000, // R$ 1.000,00
        prizeValue: 10000, // R$ 10.000,00
        maxNumber: 10000,
        winningNumbers: "100,88,14",
        autoDrawnNumbers: 1,
        winningProbability: 100,
        isActive: true
      }
    });
    
    console.log('Configuração inicial criada:', raffleConfig);
  } else {
    console.log('Configuração já existe:', existingConfig);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });