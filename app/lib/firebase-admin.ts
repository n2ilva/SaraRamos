import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Tenta pegar as credenciais do ambiente
// Em produção (Vercel/Netlify), você deve configurar essas variáveis de ambiente
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app: App;

if (!getApps().length) {
  // Se tiver credenciais completas, usa elas
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: 'sararamos-d0fc0.firebasestorage.app'
    });
  } else {
    // Fallback: Tenta usar Default Credentials (bom para Google Cloud / Local com gcloud login)
    // Se falhar aqui em local sem configurar, o Admin SDK vai reclamar.
    try {
        app = initializeApp({
            storageBucket: 'sararamos-d0fc0.firebasestorage.app'
        });
    } catch (e) {
        console.error('Falha ao inicializar Firebase Admin. Verifique as credenciais.', e);
        // Inicializa dummy para não quebrar build, mas vai falhar em runtime
        app = initializeApp(undefined, 'dummy-app');
    }
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
export const adminAuth = getAuth(app);
