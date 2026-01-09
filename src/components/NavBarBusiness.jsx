'use client'
import Link from "next/link"
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu } from 'lucide-react';

export default function NavBarBusiness({ business }) {

    const router = useRouter()
    const count = useAppSelector((state) => state.order.count)

    function buy() {
        if (count > 0) {
            router.push(`/${business.slug}/order`)
        }
    }

    return (
        <div className="h-16"> {/* Spacer to prevent content jump since nav is fixed */}
            <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 top-0 start-0 border-b border-slate-200 shadow-sm transition-all">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-orange-100 shadow-sm group">
                            <img
                                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${business.logo}`}
                                alt={business.name}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        <Link href={`/${business.slug}`} className="flex flex-col relative top-0.5">
                            <span className="self-center text-xl sm:text-2xl font-bold whitespace-nowrap text-slate-900 tracking-tight leading-none hover:text-orange-600 transition-colors">
                                {business.name}
                            </span>
                        </Link>
                    </div>

                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
                        <button
                            onClick={buy}
                            className={`relative inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${count > 0
                                ? 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 hover:shadow-orange-500/30 transform hover:-translate-y-0.5'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            disabled={count === 0}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {count > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
                                    {count}
                                </div>
                            )}
                        </button>

                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-slate-100 rounded-lg bg-slate-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <Link href={`/${business.slug}/management`} className="block py-2 px-3 text-slate-700 rounded hover:bg-slate-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 transition-colors">
                                    Gestión
                                </Link>
                            </li>
                            <li>
                                {/* <Link href={`/${business.slug}/ingredients`} className="block py-2 px-3 text-slate-700 rounded hover:bg-slate-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 transition-colors">
                                    Ingredientes
                                </Link> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}