import { create } from 'zustand';
import { api } from '../lib/api';

interface TopProduct {
  id: string;
  name: string;
  transactions: number;
}

interface Transaction {
  id: string;
  product_name: string;
  type: 'IN' | 'OUT';
  quantity_change: number;
  created_at: string;
}

interface DashboardState {
  totalProducts: number;
  totalValue: number;
  recentTransactions: number;
  lowStockProducts: number;
  topProducts: TopProduct[];
  transactionHistory: Transaction[];
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalProducts: 0,
  totalValue: 0,
  recentTransactions: 0,
  lowStockProducts: 0,
  topProducts: [],
  transactionHistory: [],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Get dashboard metrics
      const metrics = await api.dashboard.getMetrics();
      
      // Get top products
      const topProducts = await api.dashboard.getTopProducts();
      
      // Get recent transactions
      const recentTransactions = await api.dashboard.getRecentTransactions();

      set({
        totalProducts: metrics.total_products,
        totalValue: metrics.total_value,
        recentTransactions: metrics.recent_transactions,
        lowStockProducts: metrics.low_stock_products,
        topProducts,
        transactionHistory: recentTransactions,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ 
        error: 'Error al cargar los datos del panel', 
        loading: false 
      });
    }
  },
}));