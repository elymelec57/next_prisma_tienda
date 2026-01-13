
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

    // Definimos si mostramos la lista (solo si hay algo en el buscador o se seleccionó una categoría específica)
    const shouldShowProducts = searchTerm.length > 0 || selectedCategory !== 'all'

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
                <div className="relative group max-w-2xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-orange-600 transition-all" />
                    <Input
                        placeholder="Escribe para buscar un plato (ej. Pizza, Burger, Jugo...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-16 h-16 bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl focus:ring-orange-500/20 text-lg font-bold placeholder:text-gray-300 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`
                            px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                            ${selectedCategory === 'all'
                                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20 scale-105'
                                : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}
                        `}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                            className={`
                                px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                                ${selectedCategory === cat.id.toString()
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20 scale-105'
                                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}
                            `}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Search Results - Now a vertical integrated list */}
            {shouldShowProducts ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Resultados de búsqueda ({filteredProducts.length})</p>
                    </div>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => onAddItem(product)}
                                className="group flex items-center gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 hover:border-orange-200 hover:bg-orange-50/10 transition-all active:scale-[0.99] w-full text-left shadow-sm"
                            >
                                {/* Compact Image */}
                                <div className="h-14 w-14 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-50 dark:border-gray-800">
                                    {product.mainImage ? (
                                        <img
                                            src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${product.mainImage.url}`}
                                            alt={product.nombre}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Utensils className="h-6 w-6 text-gray-200" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-extrabold text-gray-900 dark:text-white uppercase text-sm tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                                        {product.nombre}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-gray-400">
                                            {categories.find(c => c.id === product.categoriaId)?.nombre || 'Menú'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-black text-orange-600 tracking-tighter">
                                        ${product.precio.toFixed(2)}
                                    </span>
                                    <div className="h-10 w-10 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl shadow-md transition-all group-hover:bg-orange-600 group-hover:text-white">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 dark:bg-gray-900/10 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <Search className="h-8 w-8 text-gray-200 mb-2" />
                            <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Sin coincidencias</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 dark:bg-gray-900/10 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="h-20 w-20 bg-white dark:bg-gray-950 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-gray-200/50 dark:shadow-none mb-4 border border-gray-100 dark:border-gray-800">
                        <Utensils className="h-10 w-10 text-orange-600" />
                    </div>
                    <h2 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-tighter text-lg">Busca para añadir</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] max-w-xs text-center">
                        Encuentra platos rápidamente usando el buscador
                    </p>
                </div>
            )}
        </div>
    )
}
