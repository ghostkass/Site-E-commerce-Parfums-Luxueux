import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify user authentication
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No access token provided' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return { user: null, error: 'Unauthorized' };
  }
  
  return { user, error: null };
}

// Initialize default products
async function initializeProducts() {
  try {
    const existingProducts = await kv.getByPrefix('product:');
    if (existingProducts.length === 0) {
      console.log('Initializing default products...');
      
      const defaultProducts = [
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
        }
      ];

      // Store each product
      for (const product of defaultProducts) {
        await kv.set(`product:${product.id}`, product);
      }
      
      console.log(`Initialized ${defaultProducts.length} products`);
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

// Initialize products on startup
await initializeProducts();

// Routes

// Health check
app.get('/make-server-8c5b5ced/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/make-server-8c5b5ced/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error('Signup server error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Products routes
app.get('/make-server-8c5b5ced/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    const sortedProducts = products.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ products: sortedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.get('/make-server-8c5b5ced/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Cart routes (require authentication)
app.get('/make-server-8c5b5ced/cart', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    return c.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

app.post('/make-server-8c5b5ced/cart/add', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const { productId, quantity = 1 } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    // Check if product exists
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Get current cart
    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    
    // Check if item already exists in cart
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

    // Save updated cart
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ 
      message: 'Product added to cart successfully',
      cart 
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return c.json({ error: 'Failed to add product to cart' }, 500);
  }
});

app.delete('/make-server-8c5b5ced/cart/remove/:productId', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const productId = c.req.param('productId');
    
    // Get current cart
    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    
    // Remove item from cart
    cart.items = cart.items.filter((item: any) => item.productId !== productId);

    // Save updated cart
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ 
      message: 'Product removed from cart successfully',
      cart 
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return c.json({ error: 'Failed to remove product from cart' }, 500);
  }
});

// Favorites routes (require authentication)
app.get('/make-server-8c5b5ced/favorites', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const favorites = await kv.get(`favorites:${user.id}`) || { productIds: [] };
    return c.json({ favorites: favorites.productIds });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return c.json({ error: 'Failed to fetch favorites' }, 500);
  }
});

app.post('/make-server-8c5b5ced/favorites/toggle', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const { productId } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    // Check if product exists
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Get current favorites
    const favorites = await kv.get(`favorites:${user.id}`) || { productIds: [] };
    
    // Toggle favorite
    const index = favorites.productIds.indexOf(productId);
    const isFavorite = index !== -1;
    
    if (isFavorite) {
      favorites.productIds.splice(index, 1);
    } else {
      favorites.productIds.push(productId);
    }

    // Save updated favorites
    await kv.set(`favorites:${user.id}`, favorites);

    return c.json({ 
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite,
      favorites: favorites.productIds
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return c.json({ error: 'Failed to toggle favorite' }, 500);
  }
});

// Orders routes (require authentication)
app.post('/make-server-8c5b5ced/orders', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const { items, shippingAddress, billingAddress } = await c.req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'Order items are required' }, 400);
    }

    // Validate products and calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await kv.get(`product:${item.productId}`);
      if (!product) {
        return c.json({ error: `Product ${item.productId} not found` }, 404);
      }
      
      if (product.stock < item.quantity) {
        return c.json({ error: `Insufficient stock for ${product.name}` }, 400);
      }
      
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productBrand: product.brand,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Create order
    const orderId = `order-${user.id}-${Date.now()}`;
    const order = {
      id: orderId,
      userId: user.id,
      items: orderItems,
      total,
      shippingAddress,
      billingAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order
    await kv.set(`order:${orderId}`, order);
    
    // Clear user's cart
    await kv.set(`cart:${user.id}`, { items: [] });

    return c.json({ 
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

app.get('/make-server-8c5b5ced/orders', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    // Get all orders for user
    const allOrders = await kv.getByPrefix('order:');
    const userOrders = allOrders.filter((order: any) => order.userId === user.id);
    
    // Sort by creation date (newest first)
    userOrders.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ orders: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Search products
app.get('/make-server-8c5b5ced/search', async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase() || '';
    const category = c.req.query('category') || '';
    const type = c.req.query('type') || '';
    const minPrice = parseFloat(c.req.query('minPrice') || '0');
    const maxPrice = parseFloat(c.req.query('maxPrice') || '999999');
    
    const allProducts = await kv.getByPrefix('product:');
    
    let filteredProducts = allProducts.filter((product: any) => {
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      
      const matchesCategory = !category || product.category === category;
      const matchesType = !type || product.type === type;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      return matchesQuery && matchesCategory && matchesType && matchesPrice;
    });

    return c.json({ products: filteredProducts });
  } catch (error) {
    console.error('Error searching products:', error);
    return c.json({ error: 'Failed to search products' }, 500);
  }
});

// Get user profile
app.get('/make-server-8c5b5ced/profile', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

serve(app.fetch);