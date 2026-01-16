import "./globals.css";
import { Outfit } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import CartSidebar from './components/CartSidebar';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Professora Sara - Educação Infantil',
  description: 'Site educativo para crianças',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} bg-pink-50 min-h-screen flex flex-col text-gray-800`}>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
