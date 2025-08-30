# Sistema de Rifas Automáticas

Este é um sistema completo de rifas automáticas desenvolvido com Next.js, que permite aos usuários comprar bilhetes e participar de sorteios com resultados imediatos.

## Funcionalidades

### Para Usuários:
- Página inicial com informações da rifa
- Contador regressivo para o próximo sorteio
- Compra de bilhetes com sorteio automático
- Exibição de resultados imediatos ("Parabéns, você ganhou!" ou "Não foi dessa vez")
- Envio automático de e-mails para vencedores
- Visualização dos últimos vencedores
- Pagamento via PIX integrado

### Para Administradores:
- Painel administrativo em `/admin` com navegação por abas
- Sistema de autenticação seguro
- Listagem de todos os bilhetes comprados
- Exibição de estatísticas de vendas com gráficos
- Visualização dos vencedores
- Configuração da chance de vitória
- Dashboard com métricas em tempo real
- Notificações por e-mail

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS para estilização
- Prisma ORM com PostgreSQL
- Chart.js para gráficos
- JWT para autenticação
- Nodemailer para envio de e-mails
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

3. Configure as variáveis de ambiente no arquivo `.env` (use `.env.example` como modelo):
```env
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha
ADMIN_EMAIL=seu@email.com
JWT_SECRET=sua_chave_secreta_segura
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

4. Execute as migrações do banco de dados (se necessário):
```bash
npx prisma db push
```

5. Popule o banco de dados com dados iniciais:
```bash
npm run seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse o aplicativo:
- Página principal: `http://localhost:3000`
- Painel administrativo: `http://localhost:3000/admin`

## Estrutura do Projeto

```
app/
  ├── page.tsx                 # Página principal da rifa
  ├── layout.tsx               # Layout raiz com navegação
  ├── middleware.ts            # Middleware de segurança
  ├── lib/
  │   ├── emailService.ts      # Serviço de envio de e-mails
  │   └── horsepayService.ts   # Serviço de integração com HorsePay
  ├── api/
  │   ├── comprar/route.ts     # Endpoint de compra e sorteio
  │   ├── pix/webhook/route.ts # Webhook para notificações de pagamento
  │   └── admin/
  │       ├── auth/route.ts    # Endpoint de autenticação
  │       ├── tickets/route.ts # Endpoint para listar bilhetes
  │       ├── winners/route.ts # Endpoint para listar vencedores
  │       └── settings/route.ts# Endpoint para configurações
  └── admin/
      ├── page.tsx             # Painel administrativo
      └── login/page.tsx       # Página de login
prisma/
  ├── schema.prisma            # Definição do banco de dados com Prisma
  ├── schema.sql               # Schema SQL do banco de dados (referência)
  ├── seed.ts                  # Script para popular o banco de dados
  └── test-db-connection.ts    # Script para testar a conexão com o banco
```

## Segurança

- Middleware para proteção de rotas administrativas
- Autenticação JWT para acesso ao painel administrativo
- Rastreamento de IP e user agent dos usuários
- Validação de dados de entrada

## Sistema de E-mails

O sistema envia automaticamente e-mails para:
- Vencedores da rifa (quando fornecem e-mail)
- Administradores (para notificações importantes)

Para configurar o envio de e-mails em produção, defina as seguintes variáveis de ambiente:
```env
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha
```

## Sistema de Pagamentos PIX

O sistema está integrado com a HorsePay para processamento de pagamentos PIX.

### HorsePay (Provedor principal)

1. Crie uma conta na [HorsePay](https://horsepay.io/)
2. Obtenha suas credenciais no painel de desenvolvedor
3. Configure as seguintes variáveis de ambiente:
```env
HORSEPAY_CLIENT_KEY=sua_client_key
HORSEPAY_CLIENT_SECRET=sua_client_secret
HORSEPAY_CALLBACK_URL=https://seudominio.com/api/pix/webhook
WEBHOOK_URL=https://seudominio.com/api/pix/webhook
NEXT_PUBLIC_BASE_URL=https://seudominio.com
```

4. O sistema irá gerar QR Codes PIX para pagamento e processar os webhooks automaticamente.

### Configurações adicionais do PIX
Além das credenciais específicas da HorsePay, configure também:
```env
MERCHANT_NAME=Nome da sua empresa
MERCHANT_CITY=Cidade
POS_ID=POS00001
```

## Testando a Integração

### Testando a conexão com o banco de dados
```bash
npx ts-node prisma/test-db-connection.ts
```

### Testando a autenticação com a API HorsePay
Você pode adicionar um endpoint de teste na sua API para verificar as credenciais da HorsePay.

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
   - `ADMIN_EMAIL`: E-mail do administrador
   - `JWT_SECRET`: Chave secreta para JWT
   - `SMTP_HOST`: Servidor SMTP (opcional)
   - `SMTP_PORT`: Porta SMTP (opcional)
   - `SMTP_SECURE`: Usar conexão segura (opcional)
   - `SMTP_USER`: Usuário SMTP (opcional)
   - `SMTP_PASS`: Senha SMTP (opcional)
   - Credenciais da API PIX HorsePay (obrigatório)
4. Faça o deploy clicando em "Deploy"

## Solução de Problemas

### Problemas comuns com o banco de dados

1. **Falta do schema do Prisma**: Certifique-se de que o arquivo `prisma/schema.prisma` existe e está configurado corretamente.

2. **Conexão com o banco de dados**: Verifique se a variável `DATABASE_URL` está corretamente configurada no arquivo `.env`.

3. **Tabelas não existentes**: Execute `npx prisma db push` para criar as tabelas no banco de dados.

### Problemas comuns com a API HorsePay

1. **Credenciais incorretas**: Verifique se as variáveis `HORSEPAY_CLIENT_KEY` e `HORSEPAY_CLIENT_SECRET` estão corretamente configuradas.

2. **URLs de callback**: Certifique-se de que `HORSEPAY_CALLBACK_URL` e `WEBHOOK_URL` estão configuradas com URLs válidas e acessíveis.

3. **Problemas de rede**: Verifique se a URL da API HorsePay está acessível (`https://api.horsepay.io`).

## Personalização

Para personalizar o prêmio da rifa, substitua o conteúdo do componente de exibição do prêmio na página principal (`app/page.tsx`).

## Melhorias Implementadas

1. **Interface e Experiência do Usuário**:
   - Adicionado contador regressivo para o próximo sorteio
   - Melhorias visuais com animações e gradientes
   - Layout responsivo otimizado
   - Integração com pagamento PIX

2. **Funcionalidades do Sistema**:
   - Rastreamento de IP e user agent dos usuários
   - Validação de dados aprimorada
   - Tratamento de erros melhorado
   - Sistema de envio de e-mails automático
   - Integração com pagamento via PIX HorsePay

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

5. **Correções de Integração**:
   - Adicionado schema do Prisma para mapeamento correto do banco de dados
   - Corrigido variáveis de ambiente da API HorsePay
   - Adicionado script de teste de conexão com o banco de dados
   - Atualizado documentação com instruções detalhadas