import { FC } from 'react';
import { categories } from '../../../data/categories';

interface ServiceFiltersProps {
  selectedCategory: string;
  showAvailableOnly: boolean;
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (available: boolean) => void;
  onPriceChange: (value: number) => void;
}

export const ServiceFilters: FC<ServiceFiltersProps> = ({
  selectedCategory,
  showAvailableOnly,
  priceRange,
  onCategoryChange,
  onAvailabilityChange,
  onPriceChange
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-md border-gray-300"
      >
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showAvailableOnly}
          onChange={(e) => onAvailabilityChange(e.target.checked)}
          className="rounded text-[#468847]"
        />
        Available Only
      </label>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange[1]}
          onChange={(e) => onPriceChange(parseInt(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-600">
          Max Price: GH₵{priceRange[1]}
        </span>
      </div>
    </div>
  );
};