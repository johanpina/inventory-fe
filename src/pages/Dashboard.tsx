import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDashboardStore } from '../store/dashboardStore';
import { BarChart, Package, TrendingUp, DollarSign, Clock, ArrowUpDown } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { profile } = useAuthStore();
  const { 
    totalProducts, 
    totalValue, 
    recentTransactions,
    lowStockProducts,
    topProducts,
    transactionHistory,
    loading, 
    error,
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Datos para el gráfico de barras
  const barChartData = {
    labels: topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Número de Transacciones',
        data: topProducts.map(p => p.transactions),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de dona
  const doughnutChartData = {
    labels: ['Stock Normal', 'Bajo Stock'],
    datasets: [
      {
        data: [totalProducts - lowStockProducts, lowStockProducts],
        backgroundColor: [
          'rgba(79, 70, 229, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(79, 70, 229)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900">
                ¡Bienvenido de nuevo, {profile?.full_name}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Aquí tienes un resumen de tu inventario
              </p>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error al cargar los datos del panel
              </div>
            )}

            {/* Métricas principales */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Productos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                          ) : (
                            totalProducts
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Valor Total del Inventario
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                          ) : (
                            `$${totalValue.toFixed(2)}`
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Transacciones (24h)
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                          ) : (
                            recentTransactions
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Productos Bajo Stock
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                          ) : (
                            lowStockProducts
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Productos más Movidos
                </h3>
                {!loading && topProducts.length > 0 && (
                  <div className="h-64">
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Estado del Stock
                </h3>
                {!loading && (
                  <div className="h-64">
                    <Doughnut
                      data={doughnutChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Últimas Transacciones */}
            <div className="mt-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Últimas Transacciones
                  </h3>
                  <div className="max-h-96 overflow-y-auto pr-4">
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {transactionHistory.map((transaction) => (
                          <li key={transaction.id} className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-grow mr-4">
                                <div className="flex-shrink-0">
                                  <ArrowUpDown className={`h-5 w-5 ${
                                    transaction.type === 'IN' ? 'text-green-500' : 'text-red-500'
                                  }`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {transaction.product_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {transaction.type === 'IN' ? 'Entrada' : 'Salida'} de {Math.abs(transaction.quantity_change)} unidades
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 flex-shrink-0 w-24 text-right">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}