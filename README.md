# Sistema de Rifas Automáticas

Este é um sistema completo de rifas automáticas desenvolvido com Next.js, que permite aos usuários comprar bilhetes e participar de sorteios com resultados imediatos.

## Funcionalidades

### Para Usuários:
- Página inicial com informações da rifa
- Contador regressivo para o próximo sorteio
- Compra de bilhetes com sorteio automático
- Exibição de resultados imediatos ("Parabéns, você ganhou!" ou "Não foi dessa vez")
- Visualização dos últimos vencedores

### Para Administradores:
- Painel administrativo em `/admin` com navegação por abas
- Sistema de autenticação seguro
- Listagem de todos os bilhetes comprados
- Exibição de estatísticas de vendas com gráficos
- Visualização dos vencedores
- Configuração da chance de vitória
- Dashboard com métricas em tempo real

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS para estilização
- Prisma ORM com PostgreSQL
- Chart.js para gráficos
- JWT para autenticação
- Banco de dados PostgreSQL (Supabase)

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados:
```bash
npx prisma generate
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```env
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_segura
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o aplicativo:
- Página principal: `http://localhost:3000`
- Painel administrativo: `http://localhost:3000/admin`

## Estrutura do Projeto

```
app/
  ├── page.tsx                 # Página principal da rifa
  ├── layout.tsx               # Layout raiz com navegação
  ├── middleware.ts            # Middleware de segurança
  ├── api/
  │   ├── comprar/route.ts     # Endpoint de compra e sorteio
  │   └── admin/
  │       ├── auth/route.ts    # Endpoint de autenticação
  │       ├── tickets/route.ts # Endpoint para listar bilhetes
  │       ├── winners/route.ts # Endpoint para listar vencedores
  │       └── settings/route.ts# Endpoint para configurações
  └── admin/
      ├── page.tsx             # Painel administrativo
      └── login/page.tsx       # Página de login
prisma/
  └── schema.prisma            # Definição do banco de dados
```

## Segurança

- Middleware para proteção de rotas administrativas
- Autenticação JWT para acesso ao painel administrativo
- Rastreamento de IP e user agent dos usuários
- Validação de dados de entrada

## Configuração

A chance de vitória pode ser configurada no arquivo `.env` através da variável `WINNING_CHANCE`. O valor padrão é 100, o que significa uma chance de 1 em 100 (1%).

## Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com/) se ainda não tiver
2. Crie um novo projeto e conecte-o ao seu repositório GitHub
3. Configure as variáveis de ambiente necessárias:
   - `DATABASE_URL`: URL do seu banco de dados PostgreSQL
   - `WINNING_CHANCE`: Chance de vitória (padrão: 100)
   - `ADMIN_USERNAME`: Nome de usuário administrador
   - `ADMIN_PASSWORD`: Senha do administrador
   - `JWT_SECRET`: Chave secreta para JWT
4. Faça o deploy clicando em "Deploy"

## Personalização

Para personalizar o prêmio da rifa, substitua o conteúdo do componente de exibição do prêmio na página principal (`app/page.tsx`).

## Melhorias Implementadas

1. **Interface e Experiência do Usuário**:
   - Adicionado contador regressivo para o próximo sorteio
   - Melhorias visuais com animações e gradientes
   - Layout responsivo otimizado

2. **Funcionalidades do Sistema**:
   - Rastreamento de IP e user agent dos usuários
   - Validação de dados aprimorada
   - Tratamento de erros melhorado

3. **Painel Administrativo**:
   - Navegação por abas
   - Gráficos de estatísticas (Chart.js)
   - Dashboard com métricas em tempo real
   - Sistema de autenticação seguro
   - Configurações avançadas

4. **Performance e Segurança**:
   - Middleware de segurança para rotas administrativas
   - Autenticação JWT para acesso ao painel
   - Validação de entrada aprimorada
   - Estrutura de código mais organizada