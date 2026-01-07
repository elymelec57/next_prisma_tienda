import Link from "next/link";
import Image from "next/image";
import { Utensils, Search, ArrowRight, Star, ChefHat, Clock } from 'lucide-react';
import RestaurantList from '@/components/RestaurantList';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">

      {/* 1. NAVEGACIÓN */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tighter text-orange-600">
            <Utensils className="h-7 w-7" />
            <span>RestoApp</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <Link href="#" className="hover:text-orange-600 transition-colors">Inicio</Link>
            <Link href="#about" className="hover:text-orange-600 transition-colors">Quiénes Somos</Link>
            <Link href="#restaurants" className="hover:text-orange-600 transition-colors">Restaurantes</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-orange-700 hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5">
              Mi Perfil
            </button>
          </div>
        </div>
      </nav>

      {/* 2. PORTADA (Hero Section) */}
      <header className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Helper del fondo con Imagen y Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-hero.png"
            alt="Fondo de comida deliciosa"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/30" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 backdrop-blur-sm">
            <span className="text-orange-300 font-semibold text-sm tracking-wide uppercase">La mejor comida de tu ciudad</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm">
            Descubre sabores <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">únicos</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Explora la mejor selección de restaurantes locales, reserva tu mesa o pide a domicilio con solo un clic.
          </p>

          <div className="flex flex-col sm:flex-row max-w-lg mx-auto bg-white p-2 rounded-2xl shadow-2xl ring-4 ring-white/10">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="w-full py-3 outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent"
              />
            </div>
            <button className="mt-2 sm:mt-0 bg-orange-600 text-white rounded-xl px-8 py-3 font-bold hover:bg-orange-700 transition-colors shadow-md flex items-center justify-center gap-2">
              Buscar
            </button>
          </div>
        </div>
      </header>

      {/* 3. QUIÉNES SOMOS */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-2">Sobre Nosotros</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">Pasión por la <br /> Gastronomía</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                En RestoApp, conectamos a amantes de la comida con los mejores establecimientos.
                Nacimos con la idea de simplificar la búsqueda de experiencias culinarias,
                garantizando calidad y variedad en cada bocado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Star, text: "Selección Premium" },
                  { icon: ChefHat, text: "Chefs Reconocidos" },
                  { icon: ArrowRight, text: "Reservas Fácil" },
                  { icon: Clock, text: "Atención 24/7" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="/images/about-us.png"
                alt="Sobre RestoApp"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full">
                  <p className="text-white font-medium">"La comida une a las personas, nosotros solo hacemos el puente más corto."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ÁREA DE TARJETAS (Restaurantes) */}
      <section id="restaurants" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Nuestros Restaurantes</h2>
              <p className="text-lg text-slate-500 mt-2">Explora las opciones mejor valoradas de la semana.</p>
            </div>
            <Link href="#" className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-100 px-5 py-2.5 rounded-full transition-colors">
              Ver todos los restaurantes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <RestaurantList />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-900 mb-6">
            <Utensils className="h-6 w-6 text-orange-600" />
            <span>RestoApp</span>
          </div>
          <p className="text-slate-500 text-sm mb-6">Conectando sabores contigo.</p>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} RestoApp - Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
