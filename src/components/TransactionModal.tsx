import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types/database';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionComplete: () => void;
  product: Product;
}

export default function TransactionModal({ isOpen, onClose, onTransactionComplete, product }: TransactionModalProps) {
  const [quantity, setQuantity] = useState('1');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const quantityChange = parseInt(quantity) * (type === 'IN' ? 1 : -1);
    const newQuantity = product.quantity + quantityChange;

    if (newQuantity < 0) {
      setError('Stock insuficiente para esta transacción');
      setIsLoading(false);
      return;
    }

    // Verificar que el usuario esté autenticado y tenga un ID
    if (!user?.id) {
      setError('Error de autenticación. Por favor, vuelve a iniciar sesión.');
      setIsLoading(false);
      return;
    }

    try {
      // Crear la transacción usando la API
      await api.transactions.create({
        product_id: product.id,
        quantity_change: quantityChange,
        type,
        created_by: user.id
      });

      // Actualizar el producto con la nueva cantidad
      await api.products.update(product.id, {
        quantity: newQuantity
      });

      onTransactionComplete();
      onClose();
      setQuantity('1');
      setType('IN');
    } catch (err) {
      console.error('Error al procesar la transacción:', err);
      setError('Error al procesar la transacción. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Nueva Transacción</h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Detalles del Producto</h4>
              <p className="text-sm text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">Stock Actual: {product.quantity}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de Transacción
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'IN' | 'OUT')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="IN">Entrada de Stock</option>
                  <option value="OUT">Salida de Stock</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Procesando Transacción...
                    </div>
                  ) : (
                    'Procesar Transacción'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
