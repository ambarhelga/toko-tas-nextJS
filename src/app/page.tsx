import { Bag, bags } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';
import Recommendations from '@/components/Recommendations';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative mb-12 h-[50vh] w-full overflow-hidden rounded-lg bg-accent/30">
        <Image
          src="https://picsum.photos/seed/hero/1200/600"
          alt="Woman carrying a stylish bag"
          fill
          className="object-cover"
          data-ai-hint="fashion lifestyle"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Find Your Perfect Bag
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Explore our curated collection of stylish, high-quality bags for
            every occasion.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="#products">Shop Now</Link>
          </Button>
        </div>
      </section>

      <Recommendations allBags={bags} />

      <section id="products">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">
          Our Collection
        </h2>
        <ProductGrid bags={bags} />
      </section>
    </div>
  );
}
