-- Tabela RaffleConfig
CREATE TABLE IF NOT EXISTS "RaffleConfig" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ticketPrice" NUMERIC NOT NULL DEFAULT 1000,
  "prizeValue" NUMERIC NOT NULL DEFAULT 10000,
  "maxNumber" INTEGER NOT NULL DEFAULT 10000,
  "winningNumbers" TEXT NOT NULL,
  "autoDrawnNumbers" INTEGER NOT NULL DEFAULT 1,
  "winningProbability" INTEGER NOT NULL DEFAULT 100,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela Prize
CREATE TABLE IF NOT EXISTS "Prize" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "value" NUMERIC NOT NULL,
  "rarity" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela Ticket
CREATE TABLE IF NOT EXISTS "Ticket" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userName" TEXT NOT NULL,
  "userEmail" TEXT,
  "purchaseDate" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "isWinner" BOOLEAN NOT NULL DEFAULT false,
  "ip" TEXT,
  "userAgent" TEXT,
  "selectedNumber" INTEGER,
  "drawnNumbers" TEXT,
  "prizeId" UUID REFERENCES "Prize"("id") ON DELETE SET NULL
);

-- Tabela Winner
CREATE TABLE IF NOT EXISTS "Winner" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ticketId" UUID UNIQUE NOT NULL REFERENCES "Ticket"("id") ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  "userEmail" TEXT,
  "prizeDate" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "drawnNumbers" TEXT NOT NULL,
  "prizeId" UUID REFERENCES "Prize"("id") ON DELETE SET NULL
);

-- Inserir configuração inicial (usando um UUID válido)
INSERT INTO "RaffleConfig" (
  "ticketPrice",
  "prizeValue",
  "maxNumber",
  "winningNumbers",
  "autoDrawnNumbers",
  "winningProbability",
  "isActive"
) VALUES (
  1000,
  10000,
  10000,
  '100,88,14',
  1,
  100,
  true
);

-- Inserir prêmios de exemplo
INSERT INTO "Prize" (
  "name",
  "description",
  "value",
  "rarity"
) VALUES 
  ('Smartphone Top de Linha', 'Smartphone premium com todas as funcionalidades', 5000, 5),
  ('Notebook Gamer', 'Notebook potente para jogos e trabalho', 8000, 4),
  ('Fone de Ouvido Bluetooth', 'Fone de ouvido sem fio com cancelamento de ruído', 500, 3),
  ('Smartwatch', 'Relógio inteligente com monitoramento de saúde', 800, 2),
  ('Vale Compras R$ 100', 'Vale compras para usar em nossa loja', 100, 1)
ON CONFLICT ("name") DO NOTHING;