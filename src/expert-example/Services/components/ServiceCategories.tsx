

const categories = [
  {
    id: 'crop-advisory',
    name: 'Crop Advisory',
    description: 'Expert guidance on pest control, soil fertility, and crop management',
    icon: '🌾'
  },
  {
    id: 'livestock-health',
    name: 'Livestock Health',
    description: 'Professional veterinary care and breeding consultation',
    icon: '🐄'
  },
  {
    id: 'equipment',
    name: 'Farm Equipment',
    description: 'Equipment rental, maintenance, and repair services',
    icon: '🚜'
  },
  {
    id: 'training',
    name: 'Training & Consultation',
    description: 'Workshops and expert consultation on farming practices',
    icon: '📚'
  },
  {
    id: 'logistics',
    name: 'Supply Chain & Logistics',
    description: 'Storage, transportation, and distribution solutions',
    icon: '🚛'
  }
];


import type { FC } from 'react';

interface ServiceCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const ServiceCategories: FC<ServiceCategoriesProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`p-4 rounded-lg text-center transition-colors ${
            selectedCategory === category.id
              ? 'bg-[#468847] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-2">{category.icon}</div>
          <h3 className="font-medium mb-1">{category.name}</h3>
          <p className="text-sm opacity-75">{category.description}</p>
        </button>
      ))}
    </div>
  );
}