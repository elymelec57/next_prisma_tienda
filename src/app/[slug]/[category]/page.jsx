import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import { prisma } from '@/libs/prisma';
import Cart from '@/components/Cart';
import { notFound } from 'next/navigation';
import { ProductsData } from '@/libs/ProductsData';
import Link from 'next/link';
import { UtensilsCrossed, ChevronRight, LayoutGrid } from 'lucide-react';

export async function generateMetadata({ params }) {
    const { slug } = await params
    const business = await BusinessData(slug)
    return {
        title: business.name,
        description: business.slogan,
    }
}

export default async function page({ params }) {
    const { slug, category } = await params
    const business = await BusinessData(slug)

    if (!business) {
        notFound();
    }

    // consulto el id de la categoria (insensible a mayúsculas/minúsculas y reemplazando guiones por espacios)
    const categoryName = category.replace(/-/g, ' ');

    const categoria = await prisma.categoria.findFirst({
        where: {
            nombre: {
                equals: categoryName,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            nombre: true
        }
    });

    if (!categoria) {
        notFound();
    }

    const products = await ProductsData({ 
        id: business.id, 
        categoryId: categoria.id, 
        skip: 0, 
        take: 6 
    })

    const categoriesList = await prisma.categoria.findMany({
        where: {
            platos: {
                some: {
                    restaurantId: business.id
                }
            }
        }
    })

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBarBusiness business={business} />
            
            <div className='container mx-auto px-4 py-12 mt-20'>
                {/* Encabezado de la Categoría */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>Categoría</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight capitalize">
                        {categoria.nombre}
                    </h1>
                    <div className="h-1 w-20 bg-orange-500 rounded-full mt-4"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de Categorías */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                                <LayoutGrid className="h-5 w-5 text-orange-500" />
                                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Otras Categorías</h3>
                            </div>
                            <nav className="space-y-1">
                                {categoriesList.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/${slug}/${cat.nombre.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={`flex items-center justify-between group px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                            cat.id === categoria.id 
                                            ? 'bg-orange-600 text-white' 
                                            : 'hover:bg-orange-50'
                                        }`}
                                    >
                                        <span className={`text-sm font-medium transition-colors ${
                                            cat.id === categoria.id ? 'text-white' : 'text-slate-600 group-hover:text-orange-700'
                                        }`}>
                                            {cat.nombre}
                                        </span>
                                        <ChevronRight className={`h-4 w-4 transition-all ${
                                            cat.id === categoria.id ? 'text-orange-200' : 'text-slate-300 group-hover:text-orange-400 group-hover:translate-x-1'
                                        }`} />
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Grid de Productos */}
                    <div className="flex-grow">
                        {products.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                                <Cart 
                                    products={JSON.parse(JSON.stringify(products))} 
                                    restaurantId={business.id} 
                                    categoryId={categoria.id} 
                                />
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <img src="/images/empty-menu.svg" alt="Sin platos" className="w-32 h-32 mx-auto mb-4 opacity-20" />
                                <p className="text-slate-500 text-lg">No se encontraron productos en esta categoría.</p>
                                <Link 
                                    href={`/${slug}`}
                                    className="mt-6 inline-flex items-center text-orange-600 font-bold hover:underline"
                                >
                                    Volver al menú completo
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}