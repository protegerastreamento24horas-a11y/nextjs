import { NextResponse } from 'next/server';

// Em uma implementação real, essas credenciais viriam de variáveis de ambiente ou banco de dados
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ADMIN';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ADMIN123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('=== TENTATIVA DE LOGIN ===');
    console.log('Credenciais recebidas:', { username, password });

    // Validar credenciais
    if (!username || !password) {
      console.log('Credenciais faltando');
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar credenciais (em produção, use bcrypt ou outro método seguro)
    if (username.toString().trim() === ADMIN_USERNAME.toString().trim() && 
        password.toString().trim() === ADMIN_PASSWORD.toString().trim()) {
      
      console.log('Credenciais VÁLIDAS');
      
      // Gerar token simples (em produção, use um token mais seguro)
      const token = 'simple-auth-token-' + Date.now();
      
      console.log('Token simples gerado:', token);

      // Criar resposta com token
      const response = NextResponse.json({
        token: token,
        user: {
          username,
          role: 'admin'
        }
      });
      
      console.log('Login bem-sucedido - resposta enviada');
      return response;
    } else {
      console.log('Credenciais INVÁLIDAS');
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}