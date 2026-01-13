'use client'
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import {
    LayoutDashboard,
    Utensils,
    Carrot,
    Salad,
    ShoppingBag,
    Users,
    User,
    Square,
    Store,
    LogOut,
    Menu,
    X,
    ClipboardList,
    Banknote,
    Calendar,
} from 'lucide-react';
import { useState } from "react";

export default function NavBar({ data }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    // Dispatch auth data if needed (keeping original logic)
    if (data) {
        dispatch(auth(data))
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/user/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    const navItems = [
        { href: '/store', label: 'Dashboard', icon: LayoutDashboard, roles: ['user'] },
        { href: '/store/plato', label: 'Platos', icon: Utensils, roles: ['user'] },
        { href: '/store/ingredientes', label: 'Ingredientes', icon: Carrot, roles: ['user'] },
        { href: '/store/contornos', label: 'Contornos', icon: Salad, roles: ['user'] },
        { href: '/store/orders', label: 'Pedidos', icon: ShoppingBag, roles: ['user', 'mesero', 'cocina'] },
        { href: '/store/pedidos-mesero', label: 'Toma de Pedidos', icon: ClipboardList, roles: ['user', 'mesero'] },
        { href: '/store/caja', label: 'Control de Caja', icon: Banknote, roles: ['user', 'caja'] },
        { href: '/store/horarios', label: 'Mis Horarios', icon: Calendar, roles: ['mesero', 'caja', 'cocina'] },
        { href: '/store/mesas', label: 'Mesas', icon: Square, roles: ['user'] },
        { href: '/store/clients', label: 'Clientes', icon: Users, roles: ['user'] },
        { href: '/store/business', label: 'Mi Restaurante', icon: Store, roles: ['user'] },
        { href: '/store/empleados', label: 'Empleados', icon: Users, roles: ['user'] },
        { href: '/store/profile', label: 'Mi Perfil', icon: User, roles: ['user', 'mesero', 'caja', 'cocina'] },
    ];

    const filteredNavItems = navItems.filter(item => {
        if (!data?.role) return false;
        const userRole = data.role.toLowerCase();
        return item.roles.includes(userRole);
    });

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-30 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
                    <Store className="h-6 w-6" />
                    <span>Gestión</span>
                </div>
                <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-gray-300">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:sticky md:top-0 md:h-screen md:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Header Logo */}
                    <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                        <Link href="/store" className="flex items-center gap-2 font-bold text-xl text-orange-600 tracking-tight">
                            <Store className="h-6 w-6" />
                            <span>App Store</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Scrollable area */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)} // Close mobile menu on click
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                                        }
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer User & Logout */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                    {data?.nombre || data?.email || 'Usuario'}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                    {data?.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900 active:scale-[0.98]"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.05);
                        border-radius: 10px;
                    }
                    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.05);
                    }
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.1);
                    }
                    :global(.dark) .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.1);
                    }
                `}</style>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
