
'use client'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import {
    CalendarDays,
    Clock,
    Calendar as CalendarIcon,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    MapPin
} from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function HorariosPage() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useAppSelector((state) => state.auth.auth)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        fetchSchedules()
    }, [])

    const fetchSchedules = async () => {
        try {
            const res = await fetch('/api/user/employee/schedules')
            if (res.ok) {
                const data = await res.json()
                setSchedules(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    const getSchedulesForDay = (day) => {
        return schedules.filter(s => isSameDay(parseISO(s.startTime), day))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando cronograma...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-orange-600" />
                        Mi Horario Laboral
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        Consulta tus turnos asignados para esta semana.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-inner">
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="px-4 text-sm font-black uppercase text-gray-600 dark:text-gray-300">
                        {format(weekStart, 'MMMM yyyy', { locale: es })}
                    </span>
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day) => {
                    const daySchedules = getSchedulesForDay(day)
                    const isToday = isSameDay(day, new Date())

                    return (
                        <div key={day.toString()} className="flex flex-col h-full min-h-[200px]">
                            <div className={`
                                p-3 rounded-t-2xl border-x border-t text-center transition-all
                                ${isToday ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white'}
                            `}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-white/70' : 'text-gray-400'}`}>
                                    {format(day, 'eee', { locale: es })}
                                </p>
                                <p className="text-xl font-black">{format(day, 'd')}</p>
                            </div>

                            <div className={`
                                flex-1 p-2 border-x border-b rounded-b-2xl space-y-2
                                ${isToday ? 'bg-orange-50/30 dark:bg-orange-950/10 border-orange-100 dark:border-orange-900/30' : 'bg-gray-50/30 dark:bg-gray-900/10 border-gray-100 dark:border-gray-800'}
                            `}>
                                {daySchedules.length > 0 ? (
                                    daySchedules.map((s) => (
                                        <div key={s.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-3 w-3 text-orange-500" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase">Turno</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-900 dark:text-white">
                                                    {format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}
                                                </p>
                                                <div className="flex items-center gap-1 opacity-50">
                                                    <MapPin className="h-2 w-2" />
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter">Estación Central</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-8">
                                        <AlertCircle className="h-6 w-6 text-gray-400 mb-1" />
                                        <span className="text-[8px] font-black uppercase tracking-tighter">Libre</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight">Resumen Semanal</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Control de Asistencia</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Horas</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {schedules.reduce((acc, s) => {
                                const diff = (new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60 * 60)
                                return acc + diff
                            }, 0).toFixed(1)}h
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Días Laborales</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {new Set(schedules.map(s => format(parseISO(s.startTime), 'yyyy-MM-dd'))).size}
                        </p>
                    </div>
                    <div className="p-4 bg-orange-600 rounded-2xl border border-orange-500 text-white shadow-lg shadow-orange-500/20">
                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Próximo Turno</p>
                        <p className="text-xl font-black tracking-tight">Mañana, 08:30 AM</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
