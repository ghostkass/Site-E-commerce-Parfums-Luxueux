import type { Product } from './api';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Essence de Rose Éternelle',
    brand: 'Atelier Luxe',
    price: 185,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
    rating: 4.8,
    reviewCount: 127,
    isNew: true,
    category: 'femme',
    type: 'floral',
    description: 'Une fragrance délicate qui capture l\'essence éternelle de la rose bulgare, sublimée par des notes de pivoine et de musc blanc.',
    notes: {
      top: ['Rose bulgare', 'Bergamote', 'Cassis'],
      heart: ['Pivoine', 'Jasmin', 'Muguet'],
      base: ['Musc blanc', 'Bois de santal', 'Ambre']
    },
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Oud Imperial',
    brand: 'Maison Orient',
    price: 280,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    category: 'unisexe',
    type: 'oriental',
    description: 'Un parfum royal aux accents orientaux, où l\'oud précieux se mêle aux épices chaudes et aux bois nobles.',
    notes: {
      top: ['Safran', 'Cardamome', 'Rose'],
      heart: ['Oud cambodgien', 'Encens', 'Patchouli'],
      base: ['Bois de santal', 'Ambre gris', 'Musc']
    },
    stock: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Vanille Mystérieuse',
    brand: 'Parfum Noir',
    price: 165,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 203,
    category: 'femme',
    type: 'gourmand',
    description: 'Une vanille envoûtante aux facettes mystérieuses, enrichie de fèves tonka et de caramel fumé.',
    notes: {
      top: ['Mandarine', 'Poire', 'Poivre rose'],
      heart: ['Vanille Madagascar', 'Orchidée', 'Iris'],
      base: ['Fève tonka', 'Caramel', 'Musc']
    },
    stock: 32,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Bergamote Solaire',
    brand: 'Lumière d\'Été',
    price: 145,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=400&h=500&fit=crop',
    rating: 4.6,
    reviewCount: 156,
    category: 'unisexe',
    type: 'agrumes',
    description: 'Une explosion de fraîcheur méditerranéenne où la bergamote ensoleillée danse avec les agrumes pétillants.',
    notes: {
      top: ['Bergamote', 'Citron', 'Pamplemousse'],
      heart: ['Néroli', 'Petit grain', 'Lavande'],
      base: ['Vétiver', 'Cèdre', 'Ambre blanc']
    },
    stock: 28,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Cuir Noir Intense',
    brand: 'Maison Royal',
    price: 320,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop',
    rating: 4.5,
    reviewCount: 95,
    category: 'homme',
    type: 'cuir',
    description: 'Un parfum de caractère aux accents cuir intense, sublimé par des épices nobles et des bois fumés.',
    notes: {
      top: ['Poivre noir', 'Bergamote', 'Cardamome'],
      heart: ['Cuir', 'Iris', 'Géranium'],
      base: ['Bois fumé', 'Vétiver', 'Ambre noir']
    },
    stock: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Jasmin de Nuit',
    brand: 'Étoile Parfums',
    price: 195,
    originalPrice: 240,
    image: 'https://images.unsplash.com/photo-1594736797933-d0200e8ceb00?w=400&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 178,
    category: 'femme',
    type: 'floral',
    description: 'Un jasmin enivrant qui s\'épanouit dans la nuit, accompagné de notes florales blanches et de musc sensuel.',
    notes: {
      top: ['Mandarine verte', 'Cassis', 'Poivre rose'],
      heart: ['Jasmin sambac', 'Tubéreuse', 'Ylang-ylang'],
      base: ['Musc blanc', 'Santal', 'Vanille']
    },
    stock: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Bois de Santal',
    brand: 'Nature Précieuse',
    price: 225,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop',
    rating: 4.8,
    reviewCount: 142,
    category: 'homme',
    type: 'boisé',
    description: 'Un santal noble et raffiné, accompagné de notes boisées chaudes et de musc délicat.',
    notes: {
      top: ['Bergamote', 'Cardamome', 'Poivre rose'],
      heart: ['Santal indien', 'Cèdre', 'Vétiver'],
      base: ['Musc', 'Ambre', 'Fève tonka']
    },
    stock: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Ambre Doré',
    brand: 'Collection Exclusive',
    price: 390,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 67,
    category: 'unisexe',
    type: 'ambre',
    description: 'Un ambre précieux aux reflets dorés, sublimé par des épices rares et des résines nobles.',
    notes: {
      top: ['Safran', 'Cardamome', 'Bergamote'],
      heart: ['Ambre gris', 'Labdanum', 'Encens'],
      base: ['Musc', 'Vanille', 'Bois de santal']
    },
    stock: 12,
    createdAt: new Date().toISOString()
  }
];

// Mock local storage management for fallback
export const mockAuth = {
  currentUser: null as any,

  signIn: async (email: string, password: string) => {
    // Simple mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user = {
        id: 'mock-user-id',
        email,
        user_metadata: { name: email.split('@')[0] },
        created_at: new Date().toISOString()
      };
      
      mockAuth.currentUser = user;
      localStorage.setItem('mockUser', JSON.stringify(user));
      
      return { data: { session: { user, access_token: 'mock-token' } }, error: null };
    }
    
    return { data: null, error: 'Invalid credentials' };
  },

  signUp: async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && name) {
      return { data: { message: 'User created successfully' }, error: null };
    }
    
    return { data: null, error: 'Invalid data' };
  },

  signOut: async () => {
    mockAuth.currentUser = null;
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockCart');
    localStorage.removeItem('mockFavorites');
    return { error: null };
  },

  getSession: async () => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      mockAuth.currentUser = user;
      return { data: { session: { user, access_token: 'mock-token' } }, error: null };
    }
    return { data: { session: null }, error: null };
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    // Mock subscription
    const subscription = { unsubscribe: () => {} };
    
    // Check initial state
    mockAuth.getSession().then(({ data }) => {
      callback(data.session);
    });
    
    return { data: { subscription } };
  }
};

export const mockApi = {
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { products: mockProducts };
  },

  getCart: async () => {
    const cartData = localStorage.getItem('mockCart');
    const cart = cartData ? JSON.parse(cartData) : { items: [] };
    return { cart };
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const cartData = localStorage.getItem('mockCart');
    const cart = cartData ? JSON.parse(cartData) : { items: [] };
    
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('mockCart', JSON.stringify(cart));
    return { message: 'Product added to cart', cart };
  },

  getFavorites: async () => {
    const favoritesData = localStorage.getItem('mockFavorites');
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];
    return { favorites };
  },

  toggleFavorite: async (productId: string) => {
    const favoritesData = localStorage.getItem('mockFavorites');
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];
    
    const index = favorites.indexOf(productId);
    const isFavorite = index !== -1;
    
    if (isFavorite) {
      favorites.splice(index, 1);
    } else {
      favorites.push(productId);
    }
    
    localStorage.setItem('mockFavorites', JSON.stringify(favorites));
    
    return {
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite,
      favorites
    };
  }
};