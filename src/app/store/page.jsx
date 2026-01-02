'use client'

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';

export default function Store() {
  const Authname = useAppSelector((state) => state.auth.auth.name);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/user/store/dashboard');
        if (!response.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Cargando datos del restaurante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  const { restaurant, stats, platos, pedidos } = dashboardData;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-green-600 text-white p-8 rounded-lg shadow-lg mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Bienvenido, {Authname}!</h1>
          {restaurant.slogan && <p className="text-xl mt-2 italic">"{restaurant.slogan}"</p>}
        </div>
        {restaurant.logo && (
           <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${restaurant.logo}`} width={100} height={100} alt="" />
        )}
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Estadísticas del Restaurante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">Total de Platos</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalPlatos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">Total de Pedidos</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalPedidos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">Pedidos Pendientes</h3>
          <p className="text-4xl font-bold text-orange-600 mt-2">{stats.pedidosPendientes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">Ingresos Totales</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">${stats.ingresosTotales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700">Total de Clientes</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalClientes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Platos del Menú</h2>
          {platos.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {platos.map((plato) => (
                    <tr key={plato.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plato.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${plato.precio.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plato.disponible ? 'Sí' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No hay platos registrados.</p>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Últimos Pedidos</h2>
          {pedidos.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidos.slice(0, 5).map((pedido) => ( // Mostrar los últimos 5 pedidos
                    <tr key={pedido.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.estado}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pedido.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pedido.fechaHora).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No hay pedidos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
