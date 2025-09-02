import { useState, useEffect } from 'react';
import { Router } from './components/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { ShopPage } from './components/pages/ShopPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { apiClient, auth, type Product } from './utils/api';
import { mockProducts, mockAuth, mockApi } from './utils/mockData';
import type { Page } from './components/Router';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to check for existing session
        const { data } = await auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          await loadUserData();
        }

        // Try to load products from API
        await loadProducts();
      } catch (error) {
        console.error('Error connecting to backend, using mock data:', error);
        setUseMockData(true);
        
        // Fallback to mock data
        setProducts(mockProducts);
        
        // Check for mock user session
        const { data } = await mockAuth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          await loadMockUserData();
        }
        
        toast.info('Mode démo', {
          description: 'Connexion au serveur impossible, utilisation des données de démonstration.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const authStateHandler = useMockData ? mockAuth : auth;
    const { data: { subscription } } = authStateHandler.onAuthStateChange(async (session) => {
      setUser(session?.user || null);
      if (session?.user) {
        if (useMockData) {
          await loadMockUserData();
        } else {
          await loadUserData();
        }
      } else {
        setCartCount(0);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [useMockData]);

  const loadProducts = async () => {
    try {
      const { products } = await apiClient.getProducts();
      setProducts(products);
      setUseMockData(false);
    } catch (error) {
      console.error('Error loading products from API:', error);
      setProducts(mockProducts);
      setUseMockData(true);
      throw error; // Re-throw to trigger fallback mode
    }
  };

  const loadUserData = async () => {
    try {
      // Load cart
      const { cart } = await apiClient.getCart();
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));

      // Load favorites
      const { favorites } = await apiClient.getFavorites();
      setFavorites(favorites);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMockUserData = async () => {
    try {
      // Load mock cart
      const { cart } = await mockApi.getCart();
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));

      // Load mock favorites
      const { favorites } = await mockApi.getFavorites();
      setFavorites(favorites);
    } catch (error) {
      console.error('Error loading mock user data:', error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error('Connexion requise', {
        description: 'Vous devez être connecté pour ajouter des produits au panier.',
      });
      return;
    }

    try {
      const api = useMockData ? mockApi : apiClient;
      const { message, cart } = await api.addToCart(productId);
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
      
      const product = products.find(p => p.id === productId);
      toast.success('Produit ajouté au panier', {
        description: product ? `${product.name} a été ajouté à votre panier.` : message,
        action: {
          label: 'Voir le panier',
          onClick: () => console.log('View cart'),
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter le produit au panier.',
      });
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Connexion requise', {
        description: 'Vous devez être connecté pour gérer vos favoris.',
      });
      return;
    }

    try {
      const api = useMockData ? mockApi : apiClient;
      const { message, favorites: newFavorites } = await api.toggleFavorite(productId);
      setFavorites(newFavorites);
      
      const product = products.find(p => p.id === productId);
      toast.success(message, {
        description: product ? `${product.name}` : '',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur', {
        description: 'Impossible de modifier les favoris.',
      });
    }
  };

  const viewProduct = (productId: string) => {
    console.log('View product:', productId);
    toast.info('Page produit en développement');
  };

  const handleSignIn = async (email: string, password: string) => {
    const authHandler = useMockData ? mockAuth : auth;
    return await authHandler.signIn(email, password);
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const authHandler = useMockData ? mockAuth : auth;
    return await authHandler.signUp(email, password, name);
  };

  const handleSignOut = async () => {
    const authHandler = useMockData ? mockAuth : auth;
    return await authHandler.signOut();
  };

  const renderPage = (currentPage: Page, setCurrentPage: (page: Page) => void) => {
    const commonProps = {
      onAddToCart: addToCart,
      onToggleFavorite: toggleFavorite,
      onViewProduct: viewProduct,
      user,
      favorites,
    };

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={setCurrentPage}
            products={products.slice(0, 6)} // Show first 6 products as new arrivals
            {...commonProps}
          />
        );
      
      case 'shop':
        return (
          <ShopPage 
            products={products}
            {...commonProps}
          />
        );
      
      case 'product':
        return (
          <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-serif mb-4 text-luxury-black">Page Produit</h1>
              <p className="text-gray-600 mb-8">Cette page sera développée prochainement</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black px-6 py-3 rounded-lg transition-colors"
              >
                Retour à la Boutique
              </button>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="pt-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-5xl font-serif mb-6 text-luxury-black">Notre Histoire</h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Depuis 1985, LuxeScents façonne l'art de la parfumerie avec passion et excellence
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1594736797933-d0200e8ceb00?w=600&h=400&fit=crop"
                      alt="Notre atelier"
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-serif mb-6 text-luxury-black">L'Excellence Française</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Fondée dans le sud de la France, notre maison perpétue la tradition française de la parfumerie. 
                      Chaque fragrance est créée avec des ingrédients nobles, sélectionnés avec le plus grand soin par nos maîtres parfumeurs.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Notre savoir-faire unique nous permet de créer des parfums d'exception, alliant tradition et innovation 
                      pour révéler votre personnalité unique.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-luxury rounded-3xl p-12 text-center">
                  <h2 className="text-3xl font-serif mb-6 text-luxury-black">Nos Valeurs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-xl font-serif mb-4 text-luxury-black">Authenticité</h3>
                      <p className="text-luxury-black opacity-90">
                        Chaque parfum raconte une histoire vraie et unique
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif mb-4 text-luxury-black">Excellence</h3>
                      <p className="text-luxury-black opacity-90">
                        La qualité premium dans chaque goutte
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif mb-4 text-luxury-black">Innovation</h3>
                      <p className="text-luxury-black opacity-90">
                        Créer les fragrances de demain
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'blog':
        return (
          <div className="pt-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-serif mb-4 text-luxury-black">Blog & Conseils</h1>
                <p className="text-xl text-gray-600">Découvrez les secrets de la parfumerie</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Comment choisir son parfum signature ?",
                    excerpt: "Découvrez nos conseils pour trouver la fragrance qui vous correspond vraiment.",
                    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
                    date: "15 Nov 2024"
                  },
                  {
                    title: "Les notes olfactives expliquées",
                    excerpt: "Comprenez la structure d'un parfum : tête, cœur et fond.",
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=300&fit=crop",
                    date: "12 Nov 2024"
                  },
                  {
                    title: "L'art de la conservation des parfums",
                    excerpt: "Préservez vos fragrances dans les meilleures conditions.",
                    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=300&fit=crop",
                    date: "08 Nov 2024"
                  }
                ].map((article, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-luxury transition-all duration-300 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <p className="text-luxury-gold text-sm font-medium mb-2">{article.date}</p>
                      <h3 className="text-xl font-serif text-luxury-black mb-3">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <button className="text-luxury-gold hover:text-luxury-dark-gold font-medium">
                        Lire la suite →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div className="pt-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-serif mb-4 text-luxury-black">Contactez-nous</h1>
                  <p className="text-xl text-gray-600">Nous sommes là pour vous accompagner</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-serif mb-6 text-luxury-black">Envoyez-nous un message</h2>
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      toast.success('Message envoyé', {
                        description: 'Nous vous répondrons dans les plus brefs délais.',
                      });
                    }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Prénom"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Nom"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                          required
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Sujet"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        required
                      />
                      <textarea
                        rows={6}
                        placeholder="Votre message"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent resize-none"
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="w-full bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Envoyer le message
                      </button>
                    </form>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-serif mb-6 text-luxury-black">Nos coordonnées</h2>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                            📧
                          </div>
                          <div>
                            <p className="font-medium text-luxury-black">Email</p>
                            <p className="text-gray-600">contact@luxescents.fr</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                            📞
                          </div>
                          <div>
                            <p className="font-medium text-luxury-black">Téléphone</p>
                            <p className="text-gray-600">+33 1 23 45 67 89</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                            📍
                          </div>
                          <div>
                            <p className="font-medium text-luxury-black">Adresse</p>
                            <p className="text-gray-600">123 Avenue des Parfums<br />75001 Paris, France</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-luxury rounded-2xl p-6">
                      <h3 className="text-xl font-serif mb-4 text-luxury-black">Horaires d'ouverture</h3>
                      <div className="space-y-2 text-luxury-black opacity-90">
                        <p>Lundi - Vendredi : 9h00 - 18h00</p>
                        <p>Samedi : 10h00 - 17h00</p>
                        <p>Dimanche : Fermé</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'cart':
        return (
          <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-serif mb-4 text-luxury-black">Panier</h1>
              <p className="text-gray-600 mb-8">
                {user ? (
                  `Vous avez ${cartCount} article${cartCount > 1 ? 's' : ''} dans votre panier`
                ) : (
                  'Connectez-vous pour accéder à votre panier'
                )}
              </p>
              {useMockData && (
                <p className="text-orange-600 text-sm mb-4">
                  Mode démonstration - Les données ne sont pas sauvegardées
                </p>
              )}
              <button
                onClick={() => setCurrentPage('shop')}
                className="bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black px-6 py-3 rounded-lg transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        );
      
      case 'checkout':
        return (
          <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-serif mb-4 text-luxury-black">Commande</h1>
              <p className="text-gray-600 mb-8">Page de commande en développement</p>
              <button
                onClick={() => setCurrentPage('cart')}
                className="bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black px-6 py-3 rounded-lg transition-colors"
              >
                Retour au panier
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <HomePage
            onNavigate={setCurrentPage}
            products={products.slice(0, 6)}
            {...commonProps}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-luxury-black">Chargement de LuxeScents...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {(currentPage, setCurrentPage) => (
        <div className="min-h-screen flex flex-col">
          <Header 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
            cartCount={cartCount}
            useMockData={useMockData}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onSignOut={handleSignOut}
          />
          
          <main className="flex-1">
            {renderPage(currentPage, setCurrentPage)}
          </main>
          
          <Footer onNavigate={setCurrentPage} />
          <Toaster position="top-right" />
        </div>
      )}
    </Router>
  );
}