
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { Bag, CartItem, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type Auth } from 'firebase/auth';


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
      if (firebaseUser) {
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
        title: 'Login Successful',
        description: `Welcome back, ${appUser.name}!`,
      });
      router.push('/');
    } catch (error: any) {
      console.error("Firebase Auth Error Code:", error.code);
      console.error("Full Error:", error);
  
      let errorMessage = 'Could not log in with Google. Please try again.';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for login. Check Firebase configuration.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Login popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was canceled. Please complete the popup process to log in.';
      }
  
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
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
      toast({ title: "Removed from wishlist", description: `${bag.name} has been removed from your wishlist.` });
    } else {
      setWishlist((prev) => [...prev, bag]);
      toast({ title: "Added to wishlist", description: `${bag.name} is now in your wishlist.` });
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
