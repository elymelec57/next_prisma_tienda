import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import { prisma } from '@/libs/prisma';
import Cart from '@/components/Cart';
import { notFound } from 'next/navigation';

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

    const platos = await prisma.plato.findMany({
        where: {
            restaurantId: business.id,
            categoriaId: categoria.id
        },
        include: {
            contornos: true
        }
    })

    // Fetch images for dishes (similar to ProductsData.js)
    const imageIds = platos
        .map((p) => p.mainImageId)
        .filter((id) => id !== null);

    let imageMap = new Map();
    if (imageIds.length > 0) {
        const images = await prisma.image.findMany({
            where: {
                id: { in: imageIds },
                modelType: 'plato',
            },
            select: {
                id: true,
                url: true,
            },
        });
        imageMap = new Map(images.map((img) => [img.id, img]));
    }

    const products = platos.map((plato) => ({
        ...plato,
        mainImage: plato.mainImageId ? imageMap.get(plato.mainImageId) : null,
    }));

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBarBusiness business={business} />
            <div className='container mx-auto px-4 py-12 mt-20'>
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2 capitalize">
                        {categoria.nombre}
                    </h1>
                    <div className="h-1.5 w-20 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                {products.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        <Cart products={JSON.parse(JSON.stringify(products))} />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-lg">No se encontraron platos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    )
}