
'use client'
import { useState, useEffect } from 'react'
import { Loader2, LayoutGrid, CheckCircle2, Clock, XCircle, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function TableSelector({ onSelectTable }) {
    const [mesas, setMesas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMesas()
    }, [])

    const fetchMesas = async () => {
        try {
            const response = await fetch('/api/user/mesas')
            if (response.ok) {
                const data = await response.json()
                setMesas(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Libre': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400'
            case 'Ocupada': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400'
            case 'Reservada': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Selecciona una Mesa</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mesas.map((mesa) => (
                    <button
                        key={mesa.id}
                        onClick={() => onSelectTable(mesa)}
                        className="group relative"
                    >
                        <Card className={`
              h-full flex flex-col items-center justify-center p-6 border-2 transition-all duration-200
              hover:border-orange-500 hover:shadow-md active:scale-95
              ${getStatusColor(mesa.estado)}
            `}>
                            <span className="text-3xl font-black mb-1">{mesa.numero}</span>
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold opacity-70">
                                <Users className="h-3 w-3" />
                                {mesa.capacidad}
                            </div>

                            <div className="absolute top-2 right-2">
                                {mesa.estado === 'Libre' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {mesa.estado === 'Ocupada' && <XCircle className="h-4 w-4 text-red-500" />}
                                {mesa.estado === 'Reservada' && <Clock className="h-4 w-4 text-amber-500" />}
                            </div>
                        </Card>
                        <div className={`mt-2 text-center text-xs font-bold ${getStatusColor(mesa.estado).split(' ')[0]}`}>
                            {mesa.estado}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
