import React from 'react';
import { Link } from 'react-router-dom';
import { Package, BarChart3, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-10">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <Package className="h-10 w-10 text-white" />
              <span className="ml-3 text-2xl font-bold text-white">InventoryPro</span>
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="mt-16 sm:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-gray-300">
                  Sistema de Inventario
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-white">Gestiona tu inventario</span>
                  <span className="block text-indigo-200">de manera eficiente</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Una plataforma completa para administrar productos, realizar seguimiento de stock
                y analizar el rendimiento de tu inventario en tiempo real.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
              <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                <div className="px-4 py-8 sm:px-10">
                  <div className="space-y-6">
                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-indigo-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Análisis en tiempo real</h3>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-indigo-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Seguimiento de stock</h3>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <Users className="h-8 w-8 text-indigo-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Gestión de usuarios</h3>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <Package className="h-8 w-8 text-indigo-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Control de productos</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}