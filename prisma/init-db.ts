import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando a configuração do banco de dados...');
  
  // Criar configuração inicial da rifa
  const raffleConfig = await prisma.raffleConfig.upsert({
    where: { id: 'initial-config' },
    update: {},
    create: {
      id: 'initial-config',
      ticketPrice: 1000, // R$ 1.000,00
      prizeValue: 10000, // R$ 10.000,00
      maxNumber: 10000,
      winningNumbers: "100,88,14",
      autoDrawnNumbers: 1,
      winningProbability: 100,
      isActive: true
    }
  });
  
  console.log('Configuração da rifa criada:', raffleConfig);
  
  // Criar alguns prêmios de exemplo
  const prizes = [
    {
      name: "Smartphone Top de Linha",
      description: "Smartphone premium com todas as funcionalidades",
      value: 5000,
      rarity: 5 // Lendário
    },
    {
      name: "Notebook Gamer",
      description: "Notebook potente para jogos e trabalho",
      value: 8000,
      rarity: 4 // Épico
    },
    {
      name: "Fone de Ouvido Bluetooth",
      description: "Fone de ouvido sem fio com cancelamento de ruído",
      value: 500,
      rarity: 3 // Raro
    },
    {
      name: "Smartwatch",
      description: "Relógio inteligente com monitoramento de saúde",
      value: 800,
      rarity: 2 // Incomum
    },
    {
      name: "Vale Compras R$ 100",
      description: "Vale compras para usar em nossa loja",
      value: 100,
      rarity: 1 // Comum
    }
  ];
  
  for (const prizeData of prizes) {
    // Verificar se o prêmio já existe
    const existingPrize = await prisma.prize.findFirst({
      where: { name: prizeData.name }
    });
    
    if (!existingPrize) {
      const prize = await prisma.prize.create({
        data: prizeData
      });
      console.log('Prêmio criado:', prize.name);
    } else {
      console.log('Prêmio já existe:', prizeData.name);
    }
  }
  
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