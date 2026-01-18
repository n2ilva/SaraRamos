'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';

// Product Categories for educational content
export type ProductCategory = 
  | 'alfabetizacao'    // Aprendendo a Ler
  | 'escrita'          // Aprendendo a Escrever
  | 'matematica'       // Matemática Básica
  | 'logica'           // Lógica e Raciocínio
  | 'coordenacao'      // Coordenação Motora
  | 'artes'            // Artes e Criatividade
  | 'ciencias'         // Ciências e Natureza
  | 'musica'           // Musicalização
  | 'socioemocional'   // Educação Socioemocional
  | 'geral';           // Conteúdo Geral

export const categoryLabels: Record<ProductCategory, string> = {
  'alfabetizacao': '🔡 Alfabetização e Leitura',
  'escrita': '✍️ Escrita e Caligrafia',
  'matematica': '🧮 Matemática Divertida',
  'logica': '🧠 Lógica e Raciocínio',
  'coordenacao': '🤸 Coordenação Motora',
  'artes': '🎨 Artes e Cores',
  'ciencias': '🦖 Natureza e Ciências',
  'musica': '🎼 Musicalização',
  'socioemocional': '💝 Socioemocional',
  'geral': '✨ Diversos',
};

// Product Type
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in cents (BRL)
  type: 'video' | 'jogo' | 'atividade';
  category?: ProductCategory;
  imageUrl?: string;
  downloadUrl?: string; // URL to download the product content
  stripePaymentLink?: string;
  isActive: boolean;
  purchaseCount?: number; // For "most purchased" filter
  ageRange?: string; // e.g. "0-2 anos", "3-5 anos"
  downloadPath?: string; // Secure path in Storage (not public URL)
  createdAt: string;
  updatedAt: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByType: (type: Product['type']) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  // Fetch products from Firestore
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time listener for products
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to products:', err);
      setError('Erro ao carregar produtos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add new product (admin only)
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem adicionar produtos');
    }

    try {
      const productId = `${productData.type}-${Date.now()}`;
      const now = new Date().toISOString();
      
      const newProduct: Product = {
        ...productData,
        id: productId,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'products', productId), newProduct);
      
    } catch (err) {
      console.error('Error adding product:', err);
      throw new Error('Erro ao adicionar produto');
    }
  };

  // Update product (admin only)
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem editar produtos');
    }

    try {
      const productRef = doc(db, 'products', id);
      await setDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
    } catch (err) {
      console.error('Error updating product:', err);
      throw new Error('Erro ao atualizar produto');
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (id: string) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem excluir produtos');
    }

    try {
      // Find product to get image URL
      const product = products.find(p => p.id === id);
      
      // Delete image from storage if exists and is hosted on Firebase
      if (product?.imageUrl && product.imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, product.imageUrl);
          await deleteObject(imageRef);
        } catch (imgError) {
          console.error('Error deleting image:', imgError);
          // Continue to delete document even if image deletion fails
        }
      }

      // Delete digital file from storage if exists
      if (product?.downloadPath) {
        try {
          const fileRef = ref(storage, product.downloadPath);
          await deleteObject(fileRef);
        } catch (fileError) {
          console.error('Error deleting digital file:', fileError);
          // Continue to delete document even if file deletion fails
        }
      }

      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw new Error('Erro ao excluir produto');
    }
  };

  // Get products by type
  const getProductsByType = (type: Product['type']) => {
    return products.filter(p => p.type === type && p.isActive);
  };

  const refreshProducts = fetchProducts;

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByType,
      refreshProducts,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
