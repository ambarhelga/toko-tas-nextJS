
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { Bag, CartItem, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile, type Auth } from 'firebase/auth';


const firebaseConfig = {
  "projectId": "studio-1871759932-bd379",
  "appId": "1:930421194670:web:13356a977c08fd34ae123f",
  "apiKey": "AIzaSyDKxiXRvj17f-gOhtAFSj13i6YEWmlCewQ",
  "authDomain": "studio-1871759932-bd379.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "930421194670"
};

// Initialize Firebase only in the browser
let app: FirebaseApp;
let auth: Auth;
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (typeof window !== 'undefined') {
  app = getApp();
  auth = getAuth(app);
}


interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loginWithGoogle: () => void;
  signInWithEmailAndPassword: (email: string, pass: string) => Promise<any>;
  signUpWithEmailAndPassword: (email: string, pass: string, name: string) => Promise<any>;
  cart: CartItem[];
  addToCart: (bag: Bag) => void;
  removeFromCart: (bagId: string) => void;
  updateQuantity: (bagId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  wishlist: Bag[];
  addToWishlist: (bag: Bag) => void;
  removeFromWishlist: (bagId: string) => void;
  isInWishlist: (bagId: string) => boolean;
  browsingHistory: string[];
  addToHistory: (bagId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Bag[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (!auth) return;
    // This effect runs only once on the client after the component mounts.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const { uid, displayName, email } = firebaseUser;
        const appUser: User = {
          id: uid,
          name: displayName || 'User',
          email: email || '',
        };
        setUser(appUser);
        localStorage.setItem('user', JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));
      
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      
      const storedHistory = localStorage.getItem('browsingHistory');
      if (storedHistory) setBrowsingHistory(JSON.parse(storedHistory));

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      localStorage.setItem('browsingHistory', JSON.stringify(browsingHistory));
    }
  }, [cart, wishlist, browsingHistory, isMounted]);

  const login = (userData: User) => {
    setUser(userData);
  };
  
  const signUpWithEmailAndPassword = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      toast({
        title: 'Akun Dibuat & Verifikasi Terkirim',
        description: `Akun Anda telah dibuat. Silakan periksa email Anda untuk link verifikasi.`
      });
      return { success: true };
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      let errorMessage = 'Tidak dapat membuat akun. Silakan coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email ini sudah digunakan. Silakan coba login.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Kata sandi terlalu lemah. Harap pilih kata sandi yang lebih kuat.';
      }
      toast({
        title: 'Pendaftaran Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  const signInWithEmailAndPassword = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      if (userCredential.user.emailVerified) {
        const { uid, displayName, email } = userCredential.user;
        const appUser: User = { id: uid, name: displayName || 'User', email: email || '' };
        setUser(appUser);
        toast({ title: 'Login Berhasil', description: `Selamat datang kembali, ${appUser.name}!` });
        return { success: true };
      } else {
        toast({
          title: 'Verifikasi Email Diperlukan',
          description: 'Silakan periksa email Anda dan klik link verifikasi sebelum login.',
          variant: 'destructive',
        });
        await signOut(auth);
        return { success: false, error: 'email-not-verified' };
      }
    } catch(error: any) {
      let errorMessage = 'Email atau kata sandi tidak valid.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau kata sandi tidak valid.';
      }
      toast({
        title: 'Login Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, displayName, email } = result.user;
      const appUser: User = {
        id: uid,
        name: displayName || 'User',
        email: email || '',
      };
      setUser(appUser);
      toast({
        title: 'Login Berhasil',
        description: `Selamat datang kembali, ${appUser.name}!`,
      });
      router.push('/');
    } catch (error: any) {
      console.error("Firebase Auth Error Code:", error.code);
      console.error("Full Error:", error);
  
      let errorMessage = 'Tidak dapat login dengan Google. Silakan coba lagi.';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Domain ini tidak diizinkan untuk login. Periksa konfigurasi Firebase.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup login diblokir. Harap izinkan popup untuk situs ini.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login dibatalkan. Harap selesaikan proses popup untuk login.';
      }
  
      toast({
        title: 'Login Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast({
        title: 'Logout Berhasil',
        description: 'Anda telah berhasil logout.',
    });
    router.push('/login');
  };

  const addToCart = (bag: Bag) => {
    let updatedCart: CartItem[];
    const existingItem = cart.find((item) => item.bag.id === bag.id);

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.bag.id === bag.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { bag, quantity: 1 }];
    }
    
    setCart(updatedCart);

    const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    
    toast({
      title: "Ditambahkan ke keranjang",
      description: `Anda sekarang memiliki ${totalItems} item di keranjang Anda.`,
    });
  };

  const removeFromCart = (bagId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.bag.id !== bagId));
  };
  
  const updateQuantity = (bagId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bagId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.bag.id === bagId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.bag.price * item.quantity,
    0
  );

  const addToWishlist = (bag: Bag) => {
    if (isInWishlist(bag.id)) {
      removeFromWishlist(bag.id);
      toast({ title: "Dihapus dari daftar keinginan", description: `${bag.name} telah dihapus dari daftar keinginan Anda.` });
    } else {
      setWishlist((prev) => [...prev, bag]);
      toast({ title: "Ditambahkan ke daftar keinginan", description: `${bag.name} sekarang ada di daftar keinginan Anda.` });
    }
  };

  const removeFromWishlist = (bagId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== bagId));
  };

  const isInWishlist = (bagId: string) => {
    return wishlist.some((item) => item.id === bagId);
  };
  
  const addToHistory = useCallback((bagId: string) => {
    setBrowsingHistory(prev => {
        const newHistory = [bagId, ...prev.filter(id => id !== bagId)];
        return newHistory.slice(0, 10); // Keep last 10 viewed items
    });
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        loginWithGoogle,
        signInWithEmailAndPassword,
        signUpWithEmailAndPassword,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        browsingHistory,
        addToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

    