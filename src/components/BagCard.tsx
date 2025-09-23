"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Bag } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { cn } from '@/lib/utils';

interface BagCardProps {
  bag: Bag;
}

const BagCard = ({ bag }: BagCardProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useAppContext();

  return (
    <Card className="flex h-full transform flex-col overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/bags/${bag.id}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={bag.imageUrl}
              alt={bag.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={bag.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg font-headline">
          <Link href={`/bags/${bag.id}`} className="hover:text-primary">
            {bag.name}
          </Link>
        </CardTitle>
        <p className="text-xl font-semibold">${bag.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button onClick={() => addToCart(bag)} size="sm">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addToWishlist(bag)}
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              'h-5 w-5 text-muted-foreground transition-colors',
              isInWishlist(bag.id) && 'fill-red-500 text-red-500'
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BagCard;
