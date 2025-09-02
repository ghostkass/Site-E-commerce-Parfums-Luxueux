import { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFavorite?: boolean;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewProduct: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isNew = false,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
  onViewProduct,
  className = '',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-luxury transition-all duration-500 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {isNew && (
            <Badge className="bg-luxury-gold text-luxury-black px-3 py-1 text-xs font-semibold">
              Nouveau
            </Badge>
          )}
          {originalPrice && originalPrice > price && (
            <Badge variant="destructive" className="px-3 py-1 text-xs font-semibold">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 bg-white/80 hover:bg-white transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </Button>

        {/* Action Buttons Overlay */}
        <div className={`absolute inset-x-4 bottom-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex space-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewProduct(id);
              }}
              className="flex-1 bg-white/90 hover:bg-white text-luxury-black border border-gray-200 hover:border-luxury-gold"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(id);
              }}
              className="flex-1 bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Panier
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-luxury-gold font-medium uppercase tracking-wide">
            {brand}
          </p>
          <h3 className="font-serif text-lg text-luxury-black group-hover:text-luxury-copper transition-colors">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) 
                      ? 'fill-luxury-gold text-luxury-gold' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 pt-2">
            <span className="text-xl font-semibold text-luxury-black">
              {price}€
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}€
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}