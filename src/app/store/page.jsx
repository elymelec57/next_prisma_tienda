'use client'

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Utensils,
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Store() {
  const Authname = useAppSelector((state) => state.auth.auth.name);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/user/store/dashboard');

        if (response.status === 404) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }

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

  if (isNotFound) {
    notFound();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-red-500 gap-2">
        <p className="text-xl font-medium">Error al cargar datos</p>
        <p className="text-sm border border-red-200 bg-red-50 px-4 py-2 rounded-md dark:bg-red-900/20 dark:border-red-900">{error}</p>
      </div>
    );
  }

  const { restaurant, stats, platos, pedidos } = dashboardData;

  const statCards = [
    { title: "Ingresos Totales", value: `$${stats.ingresosTotales.toFixed(2)}`, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400" },
    { title: "Pedidos Totales", value: stats.totalPedidos, icon: ShoppingBag, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400" },
    { title: "Pendientes", value: stats.pedidosPendientes, icon: Clock, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400" },
    { title: "Total Clientes", value: stats.totalClientes, icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400" },
    { title: "Platos en Menú", value: stats.totalPlatos, icon: Utensils, color: "text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bienvenido de nuevo, <span className="font-semibold text-gray-900 dark:text-gray-200">{Authname}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          {restaurant.logo ? (
            <div className="h-10 w-10 relative overflow-hidden rounded-full border border-gray-200">
              <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${restaurant.logo}`} className="object-cover w-full h-full" alt="" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Utensils className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-gray-100">{restaurant.name}</p>
            {restaurant.slogan && <p className="text-gray-500 dark:text-gray-400 text-xs italic truncate max-w-[150px]">{restaurant.slogan}</p>}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</h4>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Últimos Pedidos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transacciones recientes de tu tienda.</p>
            </div>
            <Link href="/store/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {pedidos.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{pedido.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                          ${pedido.estado === 'Pendiente' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' :
                            pedido.estado === 'Completado' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                              'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
                                        `}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">${pedido.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(pedido.fechaHora).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <ShoppingBag className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No hay pedidos recientes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Menú Destacado</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de platos disponibles.</p>
            </div>
            <Link href="/store/plato" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {platos.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Precio</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {platos.slice(0, 5).map((plato) => (
                    <tr key={plato.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{plato.nombre}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">${plato.precio.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${plato.disponible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{plato.disponible ? 'Activo' : 'Inactivo'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Utensils className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Aún no has agregado platos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
