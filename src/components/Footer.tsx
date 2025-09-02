import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Page } from './Router';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { label: 'Accueil', page: 'home' as const },
    { label: 'Boutique', page: 'shop' as const },
    { label: 'À Propos', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  const categories = [
    'Parfums Femme',
    'Parfums Homme',
    'Unisexe',
    'Nouveautés',
    'Collections Limitées',
  ];

  return (
    <footer className="bg-luxury-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="text-2xl font-serif font-bold">
              LUXE
              <span className="text-luxury-gold">SCENTS</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Découvrez notre collection exclusive de parfums haut de gamme. 
              Chaque fragrance raconte une histoire unique et révèle votre personnalité.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-luxury-gold hover:bg-luxury-warm-gray border border-gray-600 hover:border-luxury-gold"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-luxury-gold hover:bg-luxury-warm-gray border border-gray-600 hover:border-luxury-gold"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-luxury-gold hover:bg-luxury-warm-gray border border-gray-600 hover:border-luxury-gold"
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif text-luxury-gold">Liens Rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-gray-300 hover:text-luxury-gold transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif text-luxury-gold">Catégories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-gray-300 hover:text-luxury-gold transition-colors text-left"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif text-luxury-gold">Newsletter</h4>
            <p className="text-gray-300 text-sm">
              Recevez nos dernières nouveautés et offres exclusives.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-luxury-warm-gray border-gray-600 text-white placeholder:text-gray-400 focus:border-luxury-gold"
              />
              <Button className="w-full bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black font-medium">
                S'abonner
              </Button>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 text-luxury-gold" />
                <span className="text-sm">contact@luxescents.fr</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 text-luxury-gold" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 text-luxury-gold" />
                <span className="text-sm">Paris, France</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 LuxeScents Oumar Ba. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="hover:text-luxury-gold transition-colors">
                Politique de confidentialité
              </button>
              <button className="hover:text-luxury-gold transition-colors">
                Conditions générales
              </button>
              <button className="hover:text-luxury-gold transition-colors">
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}