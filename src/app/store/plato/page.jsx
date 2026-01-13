'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, Search, Image as ImageIcon, Loader2 } from 'lucide-react';

import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import ProductForm from '@/components/ProductForm';

export default function ListProduct() {

    const params = useParams()
    const router = useRouter()
    const id = useAppSelector((state) => state.auth.auth.id)
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');


    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        platos();
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/category');
            if (res.ok) {
                const data = await res.json();
                setCategories(data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }


    const platos = async () => {
        try {
            let res = ''
            if (params.id) {
                res = await fetch(`/api/user/product`)
            } else {
                res = await fetch(`/api/user/product`)
            }

            if (res.ok) {
                const { dataPlatos } = await res.json()
                setProduct(dataPlatos || []);
            }
        } catch (error) {
            console.error("Error fetching dishes:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = product.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categoriaId === parseInt(selectedCategory);
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'disponible' ? p.disponible : !p.disponible);

        return matchesSearch && matchesCategory && matchesStatus;
    });


    const handleDeleteClick = (p) => {
        setProductToDelete(p);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        const id = productToDelete.id;
        try {
            const res = await fetch(`/api/user/product/${id}`, {
                method: 'DELETE'
            })

            const eliminado = await res.json()
            if (eliminado.status) {
                platos() // Refresh list
                toast.success(eliminado.message);
            } else {
                toast.error(eliminado.message);
            }
        } catch (error) {
            toast.error("Error al eliminar el producto");
        } finally {
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setProductToDelete(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        platos(); // Refresh data
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Productos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gestiona el menú de tu restaurante.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                </button>
            </div>

            {/* Filters section */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar plato por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="disponible">Diponible</option>
                            <option value="agotado">Agotado</option>
                        </select>
                    </div>
                </div>
            </div>


            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400 w-[80px]">
                                    Imagen
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Nombre
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400 hidden md:table-cell">
                                    Descripción
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Precio
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Estado
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                        <td className="p-4 align-middle">
                                            {p.mainImage ? (
                                                <img
                                                    src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`}
                                                    className="aspect-square rounded-md object-cover h-12 w-12 border border-gray-200"
                                                    alt={p.nombre}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                                                    <ImageIcon className="h-6 w-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                            {p.nombre}
                                        </td>
                                        <td className="p-4 align-middle text-gray-500 dark:text-gray-400 max-w-[200px] truncate hidden md:table-cell">
                                            {p.descripcion}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            ${p.precio.toFixed(2)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm
                                                ${p.disponible
                                                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                                }`}
                                            >
                                                {p.disponible ? 'Disponible' : 'Agotado'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/store/plato/${p.id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                                >
                                                    <Pencil className="h-4 w-4 text-gray-500" />
                                                    <span className="sr-only">Editar</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(p)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay productos registrados. ¡Agrega el primero!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating New Product */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Crear Nuevo Producto"
            >
                <div className="mt-2">
                    <ProductForm
                        onSuccess={handleCreateSuccess}
                        onCancel={() => setIsCreateModalOpen(false)}
                    />
                </div>
            </Modal>

            {/* Confirmation Modal for Deleting */}
            <DeleteConfirmationModal
                isOpen={!!productToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                productName={productToDelete?.nombre}
            />
        </div>
    )
}
