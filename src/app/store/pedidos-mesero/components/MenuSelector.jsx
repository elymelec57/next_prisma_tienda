
'use client'
import { useState, useEffect } from 'react'
import { Search, Utensils, Loader2, Plus, Info, LayoutGrid } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function MenuSelector({ onAddItem, userId }) {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`/api/user/product`),
                fetch('/api/category')
            ])

            if (prodRes.ok && catRes.ok) {
                const prodData = await prodRes.json()
                const catData = await catRes.json()
                setProducts(prodData.dataPlatos || [])
                setCategories(catData || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.categoriaId === parseInt(selectedCategory)
        return matchesSearch && matchesCategory && p.disponible
    })

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sincronizando menú...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Search & Categories */}
            <div className="space-y-6">
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <Input
                        placeholder="Buscar por nombre del plato..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-14 bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-orange-500/20 text-sm font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`
                            px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                            ${selectedCategory === 'all'
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20 scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}
                        `}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                            className={`
                                px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${selectedCategory === cat.id.toString()
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20 scale-105'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}
                            `}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid - Now with 3 columns on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group flex flex-col p-4 border border-gray-100 dark:border-gray-800 rounded-[2rem] bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-20 w-20 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-50 dark:border-gray-800 transition-transform group-hover:scale-105">
                                {product.mainImage ? (
                                    <img
                                        src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${product.mainImage.url}`}
                                        alt={product.nombre}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Utensils className="h-8 w-8 text-gray-200" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-tight leading-tight mb-1">
                                    {product.nombre}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-bold text-gray-400">
                                        {categories.find(c => c.id === product.categoriaId)?.nombre || 'Menú'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Precio</span>
                                <span className="text-xl font-black text-orange-600 tracking-tighter">
                                    ${product.precio.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={() => onAddItem(product)}
                                className="h-12 w-12 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-lg transition-all hover:bg-orange-600 hover:text-white active:scale-90"
                                title="Añadir al pedido"
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-900/10 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
                        <LayoutGrid className="h-10 w-10 text-gray-200" />
                    </div>
                    <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Sin coincidencias</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">Prueba con otra categoría o nombre.</p>
                </div>
            )}
        </div>
    )
}
