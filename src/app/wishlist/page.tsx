"use client";

import Link from 'next/link';
import { useAppContext } from '@/hooks/useAppContext';
import BagCard from '@/components/BagCard';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center">
          <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Save your favorite bags to view them here later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Discover Bags</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((bag) => (
            <BagCard key={bag.id} bag={bag} />
          ))}
        </div>
      )}
    </div>
  );
}
