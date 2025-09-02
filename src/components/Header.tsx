import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, User, LogOut, Heart, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AuthModal } from './auth/AuthModal';
import { toast } from 'sonner@2.0.3';
import type { Page } from './Router';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount?: number;
  useMockData?: boolean;
  onSignIn?: (email: string, password: string) => Promise<any>;
  onSignUp?: (email: string, password: string, name: string) => Promise<any>;
  onSignOut?: () => Promise<any>;
}

export function Header({ 
  currentPage, 
  onNavigate, 
  cartCount = 0, 
  useMockData = false,
  onSignIn,
  onSignUp,
  onSignOut
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial user state from localStorage if using mock data
    if (useMockData) {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [useMockData]);

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        const { error } = await onSignOut();
        if (error) {
          toast.error('Erreur de déconnexion', { description: error });
        } else {
          toast.success('Déconnexion réussie');
          setUser(null);
          onNavigate('home');
        }
      }
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      setIsSearchOpen(false);
      toast.info(`Recherche pour: ${searchQuery}`);
    }
  };

  const menuItems = [
    { label: 'Accueil', page: 'home' as const },
    { label: 'Boutique', page: 'shop' as const },
    { label: 'À Propos', page: 'about' as const },
    { label: 'Blog', page: 'blog' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="text-2xl font-serif font-bold text-luxury-black">
              LUXE
              <span className="text-luxury-gold">SCENTS</span>
            </div>
            {useMockData && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                DEMO
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm font-medium transition-colors relative ${
                  currentPage === item.page
                    ? 'text-luxury-gold'
                    : 'text-luxury-black hover:text-luxury-gold'
                }`}
              >
                {item.label}
                {currentPage === item.page && (
                  <span className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-luxury-gold"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-luxury-black hover:text-luxury-gold hover:bg-transparent"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-luxury-black hover:text-luxury-gold hover:bg-transparent">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-luxury-gold text-luxury-black text-sm font-semibold">
                        {user.user_metadata?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.user_metadata?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info('Profil bientôt disponible')}>
                    <User className="mr-2 h-4 w-4" />
                    Mon Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('Commandes bientôt disponible')}>
                    <Package className="mr-2 h-4 w-4" />
                    Mes Commandes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('Favoris bientôt disponible')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Mes Favoris
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-luxury-black hover:text-luxury-gold hover:bg-transparent"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                }
                onAuthSuccess={() => {
                  // Refresh user state
                  if (useMockData) {
                    const storedUser = localStorage.getItem('mockUser');
                    if (storedUser) {
                      setUser(JSON.parse(storedUser));
                    }
                  }
                }}
                onSignIn={onSignIn}
                onSignUp={onSignUp}
                useMockData={useMockData}
              />
            )}

            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => user ? onNavigate('cart') : toast.info('Connectez-vous pour accéder au panier')}
              className="text-luxury-black hover:text-luxury-gold hover:bg-transparent relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-luxury-gold text-luxury-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-luxury-black hover:text-luxury-gold hover:bg-transparent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <nav className="flex flex-col space-y-6 mt-8">
                  {menuItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => onNavigate(item.page)}
                      className={`text-left text-lg font-medium transition-colors ${
                        currentPage === item.page
                          ? 'text-luxury-gold'
                          : 'text-luxury-black hover:text-luxury-gold'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  {user && (
                    <>
                      <hr className="border-gray-200" />
                      <button
                        onClick={() => toast.info('Profil bientôt disponible')}
                        className="text-left text-lg font-medium text-luxury-black hover:text-luxury-gold transition-colors"
                      >
                        Mon Profil
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Rechercher un parfum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-luxury-gold"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}