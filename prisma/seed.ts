import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Configurando o banco de dados...');

  // Criar configuração inicial da rifa
  const raffleConfig = await prisma.raffleConfig.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      ticketPrice: 1000, // R$ 10,00
      prizeValue: 10000, // R$ 100,00
      maxNumber: 10000,
      winningNumbers: '100,88,14',
      autoDrawnNumbers: 1,
      winningProbability: 100,
      isActive: true
    },
  });

  console.log('Configuração da rifa criada/atualizada:', raffleConfig);

  // Criar prêmios iniciais
  const prizes = [
    {
      name: 'Smartphone Top de Linha',
      description: 'Smartphone premium da última geração',
      value: 300000, // R$ 3.000,00
      rarity: 5 // Lendário
    },
    {
      name: 'Notebook Gamer',
      description: 'Notebook gamer com configurações avançadas',
      value: 500000, // R$ 5.000,00
      rarity: 5 // Lendário
    },
    {
      name: 'Fone de Ouvido Bluetooth',
      description: 'Fone de ouvido sem fio de alta qualidade',
      value: 50000, // R$ 500,00
      rarity: 3 // Raro
    },
    {
      name: 'Smartwatch',
      description: 'Relógio inteligente com múltiplas funções',
      value: 80000, // R$ 800,00
      rarity: 4 // Épico
    },
    {
      name: 'Vale Compras R$ 100',
      description: 'Vale compras para usar em nossa loja',
      value: 10000, // R$ 100,00
      rarity: 1 // Comum
    }
  ];

  for (const prizeData of prizes) {
    const prize = await prisma.prize.upsert({
      where: { name: prizeData.name },
      update: {},
      create: prizeData,
    });
    console.log('Prêmio criado/atualizado:', prize.name);
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