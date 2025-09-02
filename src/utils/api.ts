import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

// Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  category: 'femme' | 'homme' | 'unisexe';
  type: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    productBrand: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  total: number;
  shippingAddress: any;
  billingAddress: any;
  status: string;
  createdAt: string;
}

// Create Supabase client for auth
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API client class
class ApiClient {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8c5b5ced`;
  private accessToken: string | null = null;

  async setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.accessToken ? `Bearer ${this.accessToken}` : `Bearer ${publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error ${response.status}:`, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async signUp(email: string, password: string, name: string) {
    try {
      const result = await this.fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.access_token) {
        await this.setAccessToken(data.session.access_token);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await this.setAccessToken(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session?.access_token) {
        await this.setAccessToken(data.session.access_token);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error: error.message };
    }
  }

  // Product methods
  async getProducts(): Promise<{ products: Product[] }> {
    return this.fetch('/products');
  }

  async getProduct(id: string): Promise<{ product: Product }> {
    return this.fetch(`/products/${id}`);
  }

  async searchProducts(params: {
    q?: string;
    category?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ products: Product[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.fetch(`/search?${searchParams.toString()}`);
  }

  // Cart methods
  async getCart(): Promise<{ cart: Cart }> {
    return this.fetch('/cart');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<{ message: string; cart: Cart }> {
    return this.fetch('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<{ message: string; cart: Cart }> {
    return this.fetch(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  // Favorites methods
  async getFavorites(): Promise<{ favorites: string[] }> {
    return this.fetch('/favorites');
  }

  async toggleFavorite(productId: string): Promise<{ message: string; isFavorite: boolean; favorites: string[] }> {
    return this.fetch('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Order methods
  async createOrder(orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    billingAddress: any;
  }): Promise<{ message: string; order: Order }> {
    return this.fetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<{ orders: Order[] }> {
    return this.fetch('/orders');
  }

  // Profile methods
  async getProfile(): Promise<{ user: any }> {
    return this.fetch('/profile');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Auth helper functions
export const auth = {
  onAuthStateChange: (callback: (session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        apiClient.setAccessToken(session.access_token);
      } else {
        apiClient.setAccessToken(null);
      }
      callback(session);
    });
  },

  signIn: apiClient.signIn.bind(apiClient),
  signUp: apiClient.signUp.bind(apiClient),
  signOut: apiClient.signOut.bind(apiClient),
  getSession: apiClient.getSession.bind(apiClient),
};