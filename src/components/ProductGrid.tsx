"use client";

import { useState, useCallback } from 'react';
import type { Bag } from '@/lib/types';
import BagCard from './BagCard';
import FilterSidebar from './FilterSidebar';

interface ProductGridProps {
  bags: Bag[];
}

const ProductGrid = ({ bags }: ProductGridProps) => {
  const [filteredBags, setFilteredBags] = useState<Bag[]>(bags);

  const allBrands = [...new Set(bags.map(b => b.brand))];
  const allTypes = [...new Set(bags.map(b => b.type))];

  const handleFilterChange = useCallback((newBags: Bag[]) => {
    setFilteredBags(newBags);
  }, []);

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <FilterSidebar
        allBags={bags}
        onFilterChange={handleFilterChange}
        brands={allBrands}
        types={allTypes}
      />
      <div className="flex-1">
        {filteredBags.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBags.map((bag) => (
              <BagCard key={bag.id} bag={bag} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
            <h3 className="text-xl font-semibold">No Bags Found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
