import { bags } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import BagDetailsClient from './BagDetailsClient';
import BagCard from '@/components/BagCard';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return bags.map(bag => ({
    id: bag.id,
  }));
}

export default function BagPage({ params }: { params: { id: string } }) {
  const bag = bags.find((b) => b.id === params.id);

  if (!bag) {
    notFound();
  }
  
  const relatedBags = bags.filter(b => b.type === bag.type && b.id !== bag.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full self-start overflow-hidden rounded-lg shadow-lg">
          <Image
            src={bag.imageUrl}
            alt={bag.name}
            fill
            className="object-cover"
            data-ai-hint={bag.imageHint}
            priority
          />
        </div>
        <div>
          <BagDetailsClient bag={bag} />
        </div>
      </div>
      
      <Separator className="my-12" />

      <div>
        <h2 className="mb-8 font-headline text-3xl font-bold">You Might Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedBags.map(relatedBag => (
                <BagCard key={relatedBag.id} bag={relatedBag} />
            ))}
        </div>
      </div>
    </div>
  );
}
