'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Define User Type
export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  purchases: Purchase[];
  isAdmin: boolean; // New: Admin flag
}

export interface Purchase {
  id: string;
  date: string;
  items: { title: string; price: number; type: string }[];
  total: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addPurchase: (items: { title: string; price: number; type: string }[], total: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of admin emails
const ADMIN_EMAILS = [
  'natanael2ilva@gmail.com',
  'sararamos.prof@gmail.com',
  'sararamos.souza@gmail.com',
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      // Check if user is admin (by email or Firestore field)
      const isAdminByEmail = ADMIN_EMAILS.includes(firebaseUser.email || '');

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isAdminByFirestore = userData.isAdmin === true;
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || 'Usuário',
          purchases: userData.purchases || [],
          isAdmin: isAdminByEmail || isAdminByFirestore
        });
      } else {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: 'Usuário',
          purchases: [],
          isAdmin: isAdminByEmail
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: newUser } = userCredential;

    const isAdmin = ADMIN_EMAILS.includes(email);

    const userData = {
      name,
      email,
      createdAt: new Date().toISOString(),
      purchases: [],
      isAdmin
    };

    await setDoc(doc(db, 'users', newUser.uid), userData);

    setUser({
      id: newUser.uid,
      name,
      email,
      purchases: [],
      isAdmin
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const addPurchase = async (items: { title: string; price: number; type: string }[], total: number) => {
    if (!auth.currentUser || !user) return;

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      items,
      total
    };

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        purchases: arrayUnion(newPurchase)
      });
      
      setUser(prev => prev ? { ...prev, purchases: [newPurchase, ...prev.purchases] } : null);

    } catch (error) {
      console.error("Error adding purchase:", error);
      throw error;
    }
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, addPurchase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
