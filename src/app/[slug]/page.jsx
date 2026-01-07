import { BusinessData } from '@/libs/BusinessData';
import NavBarBusiness from '@/components/NavBarBusiness';
import Cart from '@/components/Cart';
import { ProductsData } from '@/libs/ProductsData';
import { MapPin, Phone, Clock, Star, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const { slug } = await params
  const business = await BusinessData(slug)
  return {
    title: business.name,
    description: business.slogan,
  }
}

export default async function page({ params }) {
  const { slug } = await params
  const business = await BusinessData(slug)
  const products = await ProductsData(business.userId)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      <NavBarBusiness business={business} />

      {/* Hero Section del Restaurante */}
      <div className="relative h-[400px] w-full md:h-[600px] overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-hero.png" // Usamos una imagen genérica de alta calidad de fondo
            alt="Fondo Restaurante"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          {business.logo && (
            <div className="w-24 h-24 mb-6 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white">
              <img
                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${business.logo}`}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
            {business.name}
          </h1>
          <p className="text-xl text-orange-200 font-medium max-w-2xl px-4 italic">
            "{business.slogan}"
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Cards de Información (Lugar, Contacto, etc.) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Ubicación</h3>
              <p className="text-slate-600 leading-snug">{business.direcction || "Dirección no disponible"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Contacto</h3>
              <p className="text-slate-600 font-medium">{business.phone || "No registrado"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Calidad</h3>
              <p className="text-slate-600">Ingredientes frescos y atención de primera.</p>
            </div>
          </div>
        </div>

        {/* Sección de Productos */}
        <div id="menu" className="mb-20 scroll-mt-24">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Nuestra Carta</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Platillos Destacados
            </h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full mt-4"></div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
            <Cart products={JSON.parse(JSON.stringify(products))} />
          </div>
        </div>
      </div>
    </div>
  )
}
