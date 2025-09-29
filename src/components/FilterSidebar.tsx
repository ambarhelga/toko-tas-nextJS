
"use client";

import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

interface FilterSidebarProps {
  onFilterChange: (filters: {
    selectedTypes?: string[];
    selectedBrands?: string[];
    priceRange?: [number, number];
  }) => void;
  brands: string[];
  types: string[];
  maxPrice: number;
  selectedTypes: string[];
  selectedBrands: string[];
  priceRange: [number, number];
}

const FilterSidebar = ({ onFilterChange, brands, types, maxPrice, selectedTypes, selectedBrands, priceRange }: FilterSidebarProps) => {

  const handleTypeChange = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type) 
      ? selectedTypes.filter(t => t !== type) 
      : [...selectedTypes, type];
    onFilterChange({ selectedTypes: newSelectedTypes });
  };

  const handleBrandChange = (brand: string) => {
    const newSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onFilterChange({ selectedBrands: newSelectedBrands });
  };

  const handlePriceChange = (value: [number, number]) => {
    onFilterChange({ priceRange: value });
  }

  const clearFilters = () => {
    onFilterChange({
        selectedTypes: [],
        selectedBrands: [],
        priceRange: [0, maxPrice]
    });
  };

  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="sticky top-20 space-y-6 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
            <h3 className="font-headline text-lg font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Type</h4>
          <div className="space-y-2">
            {types.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeChange(type)}
                />
                <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Brand</h4>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
            <h4 className="mb-4 font-semibold">Price Range</h4>
             <Slider
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={handlePriceChange}
             />
             <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
             </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
