"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Bag } from '@/lib/types';
import BagCard from './BagCard';
import FilterSidebar from './FilterSidebar';

interface ProductGridProps {
  bags: Bag[];
}

const ProductGrid = ({ bags }: ProductGridProps) => {
  const allBrands = useMemo(() => [...new Set(bags.map(b => b.brand))], [bags]);
  const allTypes = useMemo(() => [...new Set(bags.map(b => b.type))], [bags]);
  const maxPrice = useMemo(() => {
      if (bags.length === 0) return 300;
      return Math.ceil(Math.max(...bags.map(b => b.price)));
  }, [bags]);

  const [filters, setFilters] = useState<{
    selectedTypes: string[];
    selectedBrands: string[];
    priceRange: [number, number];
  }>({
    selectedTypes: [],
    selectedBrands: [],
    priceRange: [0, maxPrice],
  });

  const handleFilterChange = useCallback((newFilters: {
    selectedTypes?: string[];
    selectedBrands?: string[];
    priceRange?: [number, number];
  }) => {
    setFilters(prevFilters => ({...prevFilters, ...newFilters}));
  }, []);
  
  const filteredBags = useMemo(() => {
    return bags.filter(bag => {
        const typeMatch = filters.selectedTypes.length === 0 || filters.selectedTypes.includes(bag.type);
        const brandMatch = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(bag.brand);
        const priceMatch = bag.price >= filters.priceRange[0] && bag.price <= filters.priceRange[1];
        return typeMatch && brandMatch && priceMatch;
    });
  }, [bags, filters]);

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        brands={allBrands}
        types={allTypes}
        maxPrice={maxPrice}
        selectedTypes={filters.selectedTypes}
        selectedBrands={filters.selectedBrands}
        priceRange={filters.priceRange}
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
