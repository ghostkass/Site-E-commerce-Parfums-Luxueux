import { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ProductCard } from '../ProductCard';
import { motion } from 'motion/react';
import { apiClient, type Product } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface ShopPageProps {
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewProduct: (id: string) => void;
  products: Product[];
  user?: any;
  favorites: string[];
}

export function ShopPage({ 
  onAddToCart, 
  onToggleFavorite, 
  onViewProduct, 
  products: initialProducts, 
  user, 
  favorites 
}: ShopPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate categories, types, and brands from products
  const categories = [
    { id: 'all', label: 'Tous', count: initialProducts.length },
    { id: 'femme', label: 'Femme', count: initialProducts.filter(p => p.category === 'femme').length },
    { id: 'homme', label: 'Homme', count: initialProducts.filter(p => p.category === 'homme').length },
    { id: 'unisexe', label: 'Unisexe', count: initialProducts.filter(p => p.category === 'unisexe').length },
  ];

  const types = [...new Set(initialProducts.map(p => p.type))].map(type => ({
    id: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  const brands = [...new Set(initialProducts.map(p => p.brand))];

  // Filter and sort products
  useEffect(() => {
    let products = [...initialProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      products = products.filter(product => selectedCategories.includes(product.category));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      products = products.filter(product => selectedTypes.includes(product.type));
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      products = products.filter(product => selectedBrands.includes(product.brand));
    }

    // Apply price filter
    products = products.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredProducts(products);
  }, [
    initialProducts,
    searchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    priceRange,
    sortBy
  ]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (categoryId === 'all') {
      setSelectedCategories(checked ? ['all'] : []);
    } else {
      setSelectedCategories(prev => {
        const newCategories = checked 
          ? [...prev.filter(c => c !== 'all'), categoryId]
          : prev.filter(c => c !== categoryId);
        return newCategories;
      });
    }
  };

  const handleTypeChange = (typeId: string, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, typeId] : prev.filter(t => t !== typeId)
    );
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev => 
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSortBy('featured');
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif mb-4 text-luxury-black">Notre Boutique</h1>
          <p className="text-xl text-gray-600">Découvrez notre collection de parfums d'exception</p>
        </motion.div>

        {/* Search & Filters Bar */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un parfum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Mis en avant</SelectItem>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.aside 
            className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Clear Filters */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-serif text-luxury-black">Filtres</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Effacer
              </Button>
            </div>

            {/* Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-serif mb-4 text-luxury-black">Catégories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox 
                      id={category.id} 
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <label htmlFor={category.id} className="flex-1 flex items-center justify-between text-sm">
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Price Range */}
            <Card className="p-6">
              <h3 className="text-lg font-serif mb-4 text-luxury-black">Prix</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1]}€</span>
                </div>
              </div>
            </Card>

            {/* Fragrance Types */}
            {types.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-serif mb-4 text-luxury-black">Types de Fragrances</h3>
                <div className="space-y-3">
                  {types.map((type) => (
                    <div key={type.id} className="flex items-center space-x-3">
                      <Checkbox 
                        id={type.id} 
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                      />
                      <label htmlFor={type.id} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Brands */}
            {brands.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-serif mb-4 text-luxury-black">Marques</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-3">
                      <Checkbox 
                        id={brand} 
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                      />
                      <label htmlFor={brand} className="text-sm">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-medium">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-serif mb-4 text-luxury-black">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun parfum ne correspond à vos critères de recherche.
                </p>
                <Button onClick={clearFilters} className="bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black">
                  Effacer les filtres
                </Button>
              </div>
            ) : (
              <motion.div 
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                layout
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      isNew={product.isNew}
                      isFavorite={favorites.includes(product.id)}
                      onAddToCart={onAddToCart}
                      onToggleFavorite={onToggleFavorite}
                      onViewProduct={onViewProduct}
                      className={viewMode === 'list' ? 'flex-row' : ''}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}