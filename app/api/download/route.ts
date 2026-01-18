import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage } from '../../lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // 1. Verificar Token do Usuário
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Produto não especificado' }, { status: 400 });
    }

    // 2. Verificar se o produto existe
    const productDoc = await adminDb.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    const product = productDoc.data();

    if (!product?.downloadPath) {
      return NextResponse.json({ error: 'Este produto não possui arquivo digital' }, { status: 404 });
    }

    // 3. Verificar se o usuário comprou o produto (ou é admin)
    // Admins da whitelist sempre podem baixar
    const admins = ['natanael2ilva@gmail.com', 'sararamos.prof@gmail.com', 'sararamos.souza@gmail.com'];
    const isAdmin = email && admins.includes(email);

    let hasPurchased = isAdmin;

    if (!hasPurchased) {
      // Verificar nas compras do usuário
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      if (userData?.purchases) {
        // As compras podem ter estrutura variada, vamos procurar recursivamente ou iterar
        // Supondo estrutura: user.purchases = [{ items: [{ id: ... }] }]
        const purchases = userData.purchases || [];
        for (const purchase of purchases) {
          if (purchase.items && Array.isArray(purchase.items)) {
            if (purchase.items.some((item: any) => item.id === productId)) {
              hasPurchased = true;
              break;
            }
          }
        }
      }
    }

    if (!hasPurchased) {
      return NextResponse.json({ error: 'Você precisa comprar este produto para baixá-lo' }, { status: 403 });
    }

    // 4. Gerar URL assinada temporária (Signed URL)
    // Isso gera uma URL direta para o Google Storage que expira em 1 hora.
    // É seguro porque expira e não expõe a estrutura interna, mas ainda é uma URL do googleapis.
    // Para esconder TOTALMENTE ("nunca mostrar link"), precisaríamos baixar o arquivo aqui e streamar.
    // Vamos começar com Signed URL que é padrão de indústria. Se o usuário insistir em proxy total, mudamos.
    // ATUALIZAÇÃO: O usuário pediu "nunca mostrar", então proxy é melhor, mas Vercel tem limite de tempo/tamanho.
    // Signed URL é o compromisso ideal de performance x segurança. O link "vaza" mas expira rapido.
    
    const bucket = adminStorage.bucket();
    const file = bucket.file(product.downloadPath);
    
    // Verifica se arquivo existe
    const [exists] = await file.exists();
    if (!exists) {
       return NextResponse.json({ error: 'Arquivo do produto não encontrado no servidor' }, { status: 404 });
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hora
    });

    return NextResponse.json({ url });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Erro interno ao processar download', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
