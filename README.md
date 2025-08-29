# Sistema de Rifas Automáticas

Este é um sistema completo de rifas automáticas desenvolvido com Next.js, que permite aos usuários comprar bilhetes e participar de sorteios com resultados imediatos.

## Funcionalidades

### Para Usuários:
- Página inicial com informações da rifa
- Compra de bilhetes com sorteio automático
- Exibição de resultados imediatos ("Parabéns, você ganhou!" ou "Não foi dessa vez")
- Visualização dos últimos vencedores

### Para Administradores:
- Painel administrativo em `/admin`
- Listagem de todos os bilhetes comprados
- Exibição de estatísticas de vendas
- Visualização dos vencedores
- Configuração da chance de vitória

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS para estilização
- Prisma ORM com PostgreSQL
- Banco de dados PostgreSQL

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados:
```bash
npx prisma generate
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o aplicativo em `http://localhost:3000`

## Estrutura do Projeto

```
app/
  ├── page.tsx              # Página principal da rifa
  ├── layout.tsx            # Layout raiz com navegação
  ├── api/
  │   ├── comprar/route.ts  # Endpoint de compra e sorteio
  │   └── admin/
  │       ├── tickets/route.ts   # Endpoint para listar bilhetes
  │       ├── winners/route.ts   # Endpoint para listar vencedores
  │       └── settings/route.ts  # Endpoint para configurações
  └── admin/
      └── page.tsx          # Painel administrativo
prisma/
  └── schema.prisma         # Definição do banco de dados
```

## Configuração

A chance de vitória pode ser configurada no arquivo `.env` através da variável `WINNING_CHANCE`. O valor padrão é 100, o que significa uma chance de 1 em 100 (1%).

## Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com/) se ainda não tiver
2. Crie um novo projeto e conecte-o ao seu repositório GitHub
3. Configure as variáveis de ambiente necessárias:
   - `DATABASE_URL`: URL do seu banco de dados PostgreSQL
   - `WINNING_CHANCE`: Chance de vitória (padrão: 100)
4. Faça o deploy clicando em "Deploy"

## Personalização

Para personalizar o prêmio da rifa, substitua o conteúdo do componente de exibição do prêmio na página principal (`app/page.tsx`).