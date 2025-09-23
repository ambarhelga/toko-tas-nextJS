"use client";

import { useEffect } from 'react';
import { Heart, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import type { Bag } from '@/lib/types';
import { useAppContext } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BagDetailsClientProps {
    bag: Bag;
}

const BagDetailsClient = ({ bag }: BagDetailsClientProps) => {
    const { addToCart, addToWishlist, isInWishlist, addToHistory } = useAppContext();
    
    useEffect(() => {
        addToHistory(bag.id);
    }, [bag.id, addToHistory]);

    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <div className="flex items-start justify-between">
                    <h1 className="font-headline text-3xl font-bold md:text-4xl">{bag.name}</h1>
                    <Badge variant="secondary" className="text-sm">{bag.brand}</Badge>
                </div>
                <p className="text-2xl font-semibold text-primary">${bag.price.toFixed(2)}</p>
            </div>
            <p className="text-lg text-muted-foreground">{bag.description}</p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" onClick={() => addToCart(bag)} className="flex-1">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
                <Button size="lg" variant="outline" onClick={() => addToWishlist(bag)} className="flex-1">
                    <Heart className={cn("mr-2 h-5 w-5", isInWishlist(bag.id) && "fill-red-500 text-red-500")} />
                    {isInWishlist(bag.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
            </div>
            
            <div className="mt-4 space-y-3 rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                    <p>Free shipping on orders over $50</p>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                    <p>3-year warranty and satisfaction guarantee</p>
                </div>
            </div>
        </div>
    );
};

export default BagDetailsClient;
