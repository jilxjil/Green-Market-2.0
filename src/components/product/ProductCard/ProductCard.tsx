import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#468847',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#468847',
      },
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 ml-1">{product.ratings.average}</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{product.traceability.location}</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-[#468847]">
              GH₵{product.price.toFixed(2)}
              <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
            </p>
            <span className="text-xs text-gray-500">
              {product.stock} available
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-2 bg-[#468847] text-white py-2 px-4 rounded-md hover:bg-[#3a7139] transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}