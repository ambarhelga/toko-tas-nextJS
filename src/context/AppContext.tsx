
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect } from 'react';
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
        description: `Welcome back, ${'appUser.name'}!`,
      });
      router.push('/');
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
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
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bag.id === bag.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.bag.id === bag.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { bag, quantity: 1 }];
    });
    toast({ title: "Added to cart", description: `${bag.name} is now in your cart.` });
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
  
  const addToHistory = (bagId: string) => {
    setBrowsingHistory(prev => {
        const newHistory = [bagId, ...prev.filter(id => id !== bagId)];
        return newHistory.slice(0, 10); // Keep last 10 viewed items
    });
  };

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
