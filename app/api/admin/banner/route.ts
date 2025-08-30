import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

// Função para verificar autenticação do administrador
async function verifyAdminAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  
  // Em uma implementação real, você verificaria o token JWT aqui
  // Por enquanto, vamos verificar se o token corresponde ao armazenado
  try {
    // Este é um exemplo simples - em produção, use JWT verification
    const storedToken = process.env.ADMIN_TOKEN;
    return token === storedToken;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  try {
    // Retornar a imagem atual do banner se existir
    const bannerPath = join(process.cwd(), 'public', 'banner.jpg');
    try {
      await readFile(bannerPath);
      return NextResponse.json({ imageUrl: '/banner.jpg' });
    } catch (error) {
      // Se não houver banner personalizado, retornar o padrão
      return NextResponse.json({ imageUrl: '/banner-bg.svg' });
    }
  } catch (error) {
    console.error('Erro ao buscar imagem do banner:', error);
    return NextResponse.json({ imageUrl: '/banner-bg.svg' });
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const isAdmin = await verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter os dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'O arquivo deve ter no máximo 5MB' },
        { status: 400 }
      );
    }

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvar arquivo na pasta public
    const filename = 'banner.jpg';
    const path = join(process.cwd(), 'public', filename);
    
    await writeFile(path, buffer);

    return NextResponse.json({ 
      message: 'Imagem do banner atualizada com sucesso',
      imageUrl: `/${filename}`
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload' },
      { status: 500 }
    );
  }
}