'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { Store, ExternalLink, Clock, CreditCard, Save, Building2, Banknote } from "lucide-react";

import GeneralTab from "./components/GeneralTab";
import HoursTab from "./components/HoursTab";
import PaymentsTab from "./components/PaymentsTab";
import PlansTab from "./components/PlansTab";
import SucursalesTab from "./components/SucursalesTab";
import CajasTab from "./components/CajasTab";

export default function Business() {
    const router = useRouter()
    const userId = useAppSelector((state) => state.auth.auth.id)

    const [activeTab, setActiveTab] = useState("general");

    const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
        queryKey: ['business', userId],
        queryFn: async () => {
            const res = await fetch(`/api/user/business/user/${userId}`);
            return res.json();
        },
        enabled: !!userId,
    });

    const restaurantId = businessData?.rest?.id;

    const { data: sucursalesData } = useQuery({
        queryKey: ['sucursales', restaurantId],
        queryFn: async () => {
            const res = await fetch(`/api/user/business/sucursales?restaurantId=${restaurantId}`);
            return res.json();
        },
        enabled: !!restaurantId,
    });

    const irPage = () => {
        if (businessData?.rest?.slug) {
            router.push(`/${businessData.rest.slug}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Configuración del Negocio</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona la información, horarios y métodos de pago.</p>
                </div>
                {restaurantId && (
                    <button
                        onClick={irPage}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 shadow-sm gap-2 w-full md:w-auto text-blue-600"
                    >
                        <ExternalLink size={16} />
                        Ver Página Pública
                    </button>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Store size={18} />
                    Información General
                </button>
                <button
                    onClick={() => setActiveTab("hours")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'hours' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Clock size={18} />
                    Horarios de Atención
                </button>
                <button
                    onClick={() => setActiveTab("payments")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'payments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <CreditCard size={18} />
                    Métodos de Pago
                </button>
                <button
                    onClick={() => setActiveTab("plans")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'plans' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Save size={18} />
                    Planes
                </button>

                <button
                    onClick={() => setActiveTab("sucursales")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'sucursales' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Building2 size={18} />
                    Sucursales
                </button>
                <button
                    onClick={() => setActiveTab("cajas")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'cajas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Banknote size={18} />
                    Cajas
                </button>
            </div>

            {/* Content Sections */}
            <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 overflow-hidden">
                <div className="p-6">
                    {activeTab === "general" && <GeneralTab userId={userId} businessData={businessData} />}
                    {activeTab === "hours" && <HoursTab userId={userId} businessData={businessData} sucursalesData={sucursalesData} />}
                    {activeTab === "payments" && <PaymentsTab userId={userId} businessData={businessData} />}
                    {activeTab === "plans" && <PlansTab userId={userId} />}
                    {activeTab === "sucursales" && <SucursalesTab businessData={businessData} sucursalesData={sucursalesData} />}
                    {activeTab === "cajas" && <CajasTab businessData={businessData} sucursalesData={sucursalesData} />}
                </div>
            </div>
        </div>
    )
}
