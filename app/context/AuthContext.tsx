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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addPurchase: (items: { title: string; price: number; type: string }[], total: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || 'Usuário',
          purchases: userData.purchases || []
        });
      } else {
        // Should not happen if registered correctly, but handle gracefully
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: 'Usuário',
          purchases: []
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
        // User is signed in, fetch data from Firestore
        await fetchUserData(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting the user
  };

  const register = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: newUser } = userCredential;

    // Create user document in Firestore
    const userData = {
      name,
      email,
      createdAt: new Date().toISOString(),
      purchases: []
    };

    await setDoc(doc(db, 'users', newUser.uid), userData);

    // Set local state immediately to improve UX (though onAuthStateChanged will eventually fire)
    setUser({
      id: newUser.uid,
      name,
      email,
      purchases: []
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
      
      // Update local state optimistic logic
      setUser(prev => prev ? { ...prev, purchases: [newPurchase, ...prev.purchases] } : null);

    } catch (error) {
      console.error("Error adding purchase:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, addPurchase }}>
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
