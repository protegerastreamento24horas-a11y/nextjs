# Rifa Premiada - Versão Simplificada

Este é um projeto simplificado de uma plataforma de rifas online, desenvolvido com Next.js para fácil implantação na Vercel.

## Funcionalidades

- Compra de bilhetes de rifa
- Painel administrativo para gerenciamento de bilhetes
- Sistema de sorteio de vencedores
- Design responsivo com Tailwind CSS

## Tecnologias Utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
simplified-app/
├── app/                 # Páginas da aplicação
│   ├── api/             # APIs da aplicação
│   ├── admin/           # Painel administrativo
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
├── components/          # Componentes reutilizáveis
├── lib/                 # Funções auxiliares
├── public/              # Arquivos estáticos
├── styles/              # Arquivos de estilo
├── next.config.ts       # Configuração do Next.js
├── tailwind.config.ts   # Configuração do Tailwind CSS
├── tsconfig.json        # Configuração do TypeScript
└── package.json         # Dependências e scripts
```

## Deploy na Vercel

O projeto está pronto para ser implantado na Vercel. Basta conectar seu repositório à Vercel e fazer o deploy automático.

## Próximos Passos

Para uma versão mais completa, você pode adicionar:

1. Integração com banco de dados (PostgreSQL, MongoDB, etc.)
2. Sistema de autenticação real
3. Integração com gateway de pagamento PIX
4. Envio de emails
5. Sistema de notificações