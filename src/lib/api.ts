import type { Product, Profile, Transaction } from '../types/database';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiError {
  message: string;
  status?: number;
}

interface LoginResponse {
  user: {
    email: string;
    full_name: string;
    id: string;
  };
  access_token: string;
  token_type: string;
}

interface DashboardMetrics {
  total_products: number;
  total_value: number;
  recent_transactions: number;
  low_stock_products: number;
}

interface TopProduct {
  id: string;
  name: string;
  transactions: number;
}

interface RecentTransaction {
  id: string;
  product_name: string;
  quantity_change: number;
  type: 'IN' | 'OUT';
  created_at: string;
}

// Helper function to get auth header
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: 'Ha ocurrido un error',
      status: response.status,
    };

    try {
      const data = await response.json();
      error.message = data.detail || data.message || error.message;
    } catch {
      // Si no podemos parsear el error, usamos el mensaje por defecto
      if (response.status === 401) {
        // Si es un error de autenticación, limpiamos el token
        localStorage.removeItem('access_token');
        error.message = 'Sesión expirada. Por favor, vuelve a iniciar sesión.';
      }
    }

    throw error;
  }

  return response.json();
}


// Auth API
export const auth = {
  async register(email: string, password: string, fullName: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      return handleResponse<LoginResponse>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message, status: 400 };
      }
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse<LoginResponse>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message, status: 401 };
      }
      throw error;
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      localStorage.removeItem('access_token');
      if (error instanceof Error) {
        throw { message: error.message, status: 400 };
      }
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw { message: 'No hay sesión activa', status: 401 };
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      return handleResponse<Profile>(response);
    } catch (error) {
      // Si hay un error 401, limpiamos el token
      if (error instanceof Error) {
        localStorage.removeItem('access_token');
      }
      throw error;
    }
  },
};

// Products API
export const products = {
  async getAll() {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse<Product[]>(response);
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  async update(id: string, product: Partial<Product>) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(response);
  },
};

// Transactions API
export const transactions = {
  async getAll() {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse<Transaction[]>(response);
  },

  async create(transaction: {
    product_id: string;
    quantity_change: number;
    type: 'IN' | 'OUT';
    created_by: string;
  }) {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(transaction),
    });
    return handleResponse<Transaction>(response);
  },
};

// Dashboard API
export const dashboard = {
  async getMetrics() {
    const response = await fetch(`${API_URL}/dashboard/metrics`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse<DashboardMetrics>(response);
  },

  async getTopProducts() {
    const response = await fetch(`${API_URL}/dashboard/top-products`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse<TopProduct[]>(response);
  },

  async getRecentTransactions() {
    const response = await fetch(`${API_URL}/dashboard/recent-transactions`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse<RecentTransaction[]>(response);
  },
};

export const api = {
  auth,
  products,
  transactions,
  dashboard,
};