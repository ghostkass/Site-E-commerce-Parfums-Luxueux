import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Award, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ProductCard } from '../ProductCard';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import type { Page } from '../Router';
import type { Product } from '../../utils/api';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewProduct: (id: string) => void;
  products: Product[];
  user?: any;
  favorites: string[];
}

export function HomePage({ 
  onNavigate, 
  onAddToCart, 
  onToggleFavorite, 
  onViewProduct, 
  products, 
  user, 
  favorites 
}: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get new products (first 6 from API)
  const newProducts = products.slice(0, 6);

  const categories = [
    {
      title: 'Parfums Femme',
      description: 'Élégance et sensualité',
      image: 'https://images.unsplash.com/photo-1594736797933-d0200e8ceb00?w=400&h=300&fit=crop',
      count: `${products.filter(p => p.category === 'femme').length}+ parfums`,
    },
    {
      title: 'Parfums Homme',
      description: 'Sophistication masculine',
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
      count: `${products.filter(p => p.category === 'homme').length}+ parfums`,
    },
    {
      title: 'Collections Unisexe',
      description: 'Fragrances universelles',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=300&fit=crop',
      count: `${products.filter(p => p.category === 'unisexe').length}+ parfums`,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, newProducts.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, newProducts.length - 2)) % Math.max(1, newProducts.length - 2));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-serif mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            L'Art de la
            <span className="block text-luxury-gold">Parfumerie</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Découvrez nos fragrances d'exception, créées par les plus grands maîtres parfumeurs
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black px-8 py-4 text-lg font-semibold"
              onClick={() => onNavigate('shop')}
            >
              Découvrir la Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-luxury-black px-8 py-4 text-lg"
              onClick={() => onNavigate('about')}
            >
              Notre Histoire
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-luxury-gold to-transparent"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-luxury-black" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-luxury-black">Qualité Premium</h3>
              <p className="text-gray-600">Ingrédients nobles sélectionnés par nos maîtres parfumeurs</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-luxury-black" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-luxury-black">Créations Exclusives</h3>
              <p className="text-gray-600">Fragrances uniques développées en éditions limitées</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-luxury-black" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-luxury-black">Livraison Premium</h3>
              <p className="text-gray-600">Expédition soignée et gratuite dès 150€ d'achat</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Products Slider */}
      {newProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-luxury-light-gold text-luxury-black px-4 py-2">
                Nouveautés
              </Badge>
              <h2 className="text-4xl font-serif mb-6 text-luxury-black">
                Nos Dernières Créations
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez les fragrances qui viennent d'arriver dans nos ateliers
              </p>
            </motion.div>

            {newProducts.length >= 3 ? (
              <div className="relative">
                <div className="overflow-hidden">
                  <motion.div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                  >
                    {newProducts.map((product) => (
                      <div key={product.id} className="w-1/3 flex-shrink-0 px-4">
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
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Slider Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 border"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 border"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newProducts.map((product) => (
                  <ProductCard
                    key={product.id}
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
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                onClick={() => onNavigate('shop')} 
                className="bg-luxury-black hover:bg-luxury-warm-gray text-white px-8 py-4"
              >
                Voir Toute la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-luxury-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif mb-6 text-white">
              Nos Univers Olfactifs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explorez nos collections créées pour sublimer chaque personnalité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden bg-white hover:shadow-luxury-dark transition-all duration-500 transform hover:-translate-y-2"
                  onClick={() => onNavigate('shop')}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <Badge className="mb-3 bg-luxury-gold text-luxury-black">
                        {category.count}
                      </Badge>
                      <h3 className="text-2xl font-serif mb-2">{category.title}</h3>
                      <p className="text-gray-200 group-hover:text-white transition-colors">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-luxury">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif mb-6 text-luxury-black">
              Rejoignez l'Univers LuxeScents
            </h2>
            <p className="text-xl text-luxury-black mb-8 max-w-2xl mx-auto opacity-90">
              {user ? (
                `Bienvenue ${user.user_metadata?.name || 'cher client'} ! Découvrez nos dernières créations exclusives.`
              ) : (
                'Inscrivez-vous à notre newsletter et recevez 15% de réduction sur votre première commande'
              )}
            </p>
            <Button 
              size="lg" 
              className="bg-luxury-black hover:bg-luxury-warm-gray text-white px-8 py-4 text-lg"
              onClick={() => onNavigate('contact')}
            >
              Nous Contacter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}