'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Store, Camera, Save, ArrowLeft, ExternalLink, RefreshCw, Clock, CreditCard, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";

const DAYS_OF_WEEK = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const PAYMENT_TYPES = [
    { value: 'PAGO_MOVIL', label: 'Pago Móvil' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'ZELLE', label: 'Zelle' },
    { value: 'EFECTIVO', label: 'Efectivo' }
];

export default function Business() {

    const router = useRouter()
    const queryClient = useQueryClient();
    const userId = useAppSelector((state) => state.auth.auth.id)

    const [activeTab, setActiveTab] = useState("general");
    const [showImg, setShowImg] = useState(true)
    const [image, setImage] = useState({
        mainImageId: null,
        url: '',
        image: ''
    })
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        id: '',
        name: '',
        slogan: '',
        phone: '',
        direcction: '',
        slug: '',
        currency: 'USD',
        categoriaRestaurant: [],
    });

    const [hours, setHours] = useState(
        Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            openTime: "08:00",
            closeTime: "20:00",
            isOpen: true
        }))
    );

    const [isEditingPayment, setIsEditingPayment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        type: 'PAGO_MOVIL',
        label: '',
        ownerName: '',
        ownerId: '',
        bankName: '',
        accountNumber: '',
        phoneNumber: '',
        email: '',
        isActive: true
    });

    const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
        queryKey: ['business', userId],
        queryFn: async () => {
            const res = await fetch(`/api/user/business/user/${userId}`);
            const data = await res.json();
            return data;
        },
        enabled: !!userId,
    });
    
    const { data: allCategories } = useQuery({
        queryKey: ['allRestaurantCategories'],
        queryFn: async () => {
            const res = await fetch('/api/admin/categoria-restaurant');
            const data = await res.json();
            return data.categorias || [];
        },
    });

    useEffect(() => {
        if (businessData?.status) {
            const rest = businessData.rest;
            setForm({
                id: rest.id,
                name: rest.name,
                slogan: rest.slogan,
                phone: rest.phone,
                direcction: rest.direcction,
                slug: rest.slug,
                currency: rest.currency || 'USD',
                categoriaRestaurant: rest.categoriaRestaurant?.map(c => c.id) || []
            })

            setImage({
                mainImageId: rest.mainImageId,
                url: rest.url,
                image: ''
            })

            if (rest.restaurantHours && rest.restaurantHours.length > 0) {
                const sortedHours = [...rest.restaurantHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
                setHours(sortedHours);
            }
        }
    }, [businessData]);

    const onFileChange = (e) => {
        let file = e.target.files[0];

        setImage({
            ...image,
            image: file,
        })

        let fileReader = new FileReader();
        if (file) {
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImagePreview(event.target.result);
            };
        }
    }

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const irPage = () => {
        router.push(`/${form.slug}`)
    }

    const businessMutation = useMutation({
        mutationFn: async () => {
            if (!form.id) {
                const storeBusiness = await fetch(`/api/user/business`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form, userId, logo: image.image?.name })
                });
                const rest = await storeBusiness.json()
                if (rest.status) {
                    if (image.image) {
                        await fetch(
                            `/api/avatar/upload?filename=${image.image.name}&model=restaurant&id=${rest.id}`,
                            {
                                method: 'POST',
                                body: image.image,
                            },
                        );
                    }
                }
                return rest;
            } else {
                const updateBusiness = await fetch(`/api/user/business/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form })
                });

                const rest = await updateBusiness.json()
                if (rest.status) {
                    if (image.image && image.image instanceof File) {
                        await fetch(
                            `/api/avatar/update?filename=${image.image.name}&model=restaurant&id=${rest.id}&mainImage=${rest.mainImage}`,
                            {
                                method: 'POST',
                                body: image.image,
                            },
                        );
                    }
                }
                return rest;
            }
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(form.id ? 'Negocio actualizado correctamente' : 'Negocio creado exitosamente');
                setShowImg(true);
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message || 'Error al guardar el negocio');
            }
        },
        onError: () => {
            toast.error('Error al guardar el negocio');
        }
    });

    const businessSave = (e) => {
        e.preventDefault();
        businessMutation.mutate();
    }

    const hoursMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/user/business/hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurantId: form.id, hours })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("Horarios actualizados");
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al guardar horarios");
        }
    });

    const saveHours = () => {
        if (!form.id) return toast.error("Crea tu negocio primero");
        hoursMutation.mutate();
    }

    const paymentMutation = useMutation({
        mutationFn: async () => {
            const url = isEditingPayment
                ? `/api/user/business/payment-methods/${isEditingPayment}`
                : '/api/user/business/payment-methods';
            const method = isEditingPayment ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: form.id,
                    paymentMethod: paymentForm
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(isEditingPayment ? "Método actualizado" : "Método agregado");
                setPaymentForm({
                    type: 'PAGO_MOVIL', label: '', ownerName: '', ownerId: '',
                    bankName: '', accountNumber: '', phoneNumber: '', email: '', isActive: true
                });
                setIsEditingPayment(null);
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al procesar pago");
        }
    });

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!form.id) return toast.error("Crea tu negocio primero");
        paymentMutation.mutate();
    }

    const deletePaymentMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/user/business/payment-methods/${id}`, { method: 'DELETE' });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("Eliminado");
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al eliminar");
        }
    });

    const deletePayment = (id) => {
        if (!confirm("¿Eliminar este método de pago?")) return;
        deletePaymentMutation.mutate(id);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Configuración del Negocio</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona la información, horarios y métodos de pago.</p>
                </div>
                {form.id && (
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
            <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Store size={18} />
                    Información General
                </button>
                <button
                    onClick={() => setActiveTab("hours")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'hours' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Clock size={18} />
                    Horarios de Atención
                </button>
                <button
                    onClick={() => setActiveTab("payments")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'payments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <CreditCard size={18} />
                    Métodos de Pago
                </button>
            </div>

            {/* Content Sections */}
            <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 overflow-hidden">
                <div className="p-6">
                    {activeTab === "general" && (
                        <form onSubmit={businessSave} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo del Restaurante</label>
                                <div className="flex items-center gap-6">
                                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-gray-100 shadow-sm shrink-0 bg-gray-50 flex items-center justify-center">
                                        {image.mainImageId != null && showImg ? (
                                            <img
                                                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${image.url}`}
                                                className="h-full w-full object-cover"
                                                alt="Logo"
                                            />
                                        ) : imagePreview ? (
                                            <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
                                        ) : (
                                            <Camera className="h-10 w-10 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        {image.mainImageId != null && showImg ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowImg(false)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg"
                                            >
                                                <RefreshCw size={14} />
                                                Cambiar imagen
                                            </button>
                                        ) : (
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <input
                                                    type="file"
                                                    onChange={onFileChange}
                                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium dark:border-gray-800 dark:bg-gray-950"
                                                />
                                                {image.mainImageId != null && (
                                                    <button type="button" onClick={() => setShowImg(true)} className="text-xs text-gray-500 mt-1">Cancelar cambio</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Negocio</label>
                                    <input type="text" name="name" value={form.name} onChange={changeImput} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teléfono de Contacto</label>
                                    <input type="text" name="phone" value={form.phone} onChange={changeImput} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" required />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium">Eslogan (Breve descripción)</label>
                                    <input type="text" name="slogan" value={form.slogan} onChange={changeImput} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" required />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium">Dirección Física</label>
                                    <textarea name="direcction" value={form.direcction} onChange={changeImput} rows={3} className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Moneda del Negocio</label>
                                    <select
                                        name="currency"
                                        value={form.currency}
                                        onChange={changeImput}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                    >
                                        <option value="USD">Dólares (USD)</option>
                                        <option value="COP">Pesos Colombianos (COP)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-sm font-medium">Categorías del Restaurante</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allCategories?.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    const isSelected = form.categoriaRestaurant.includes(cat.id);
                                                    const newCategories = isSelected
                                                        ? form.categoriaRestaurant.filter(id => id !== cat.id)
                                                        : [...form.categoriaRestaurant, cat.id];
                                                    setForm({ ...form, categoriaRestaurant: newCategories });
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                    form.categoriaRestaurant.includes(cat.id)
                                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-2'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {cat.nombre}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">Selecciona una o más categorías que describan tu negocio.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="submit" disabled={businessMutation.isPending} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 gap-2 shadow-sm">
                                    <Save size={18} />
                                    {businessMutation.isPending ? 'Guardando...' : 'Guardar Información'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "hours" && (
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                {hours.map((day, idx) => (
                                    <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${day.isOpen ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'}`}>
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-colors ${day.isOpen ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}`}>
                                                {DAYS_OF_WEEK[day.dayOfWeek].charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold ${day.isOpen ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>{DAYS_OF_WEEK[day.dayOfWeek]}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${day.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {day.isOpen ? 'Abierto' : 'Cerrado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">Apertura</span>
                                                    <input
                                                        type="time"
                                                        disabled={!day.isOpen}
                                                        value={day.openTime}
                                                        onChange={(e) => {
                                                            const newHours = [...hours];
                                                            newHours[idx].openTime = e.target.value;
                                                            setHours(newHours);
                                                        }}
                                                        className={`border-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none ${day.isOpen ? 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white' : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'}`}
                                                    />
                                                </div>
                                                <span className="text-gray-400 mt-5 font-bold"> - </span>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">Cierre</span>
                                                    <input
                                                        type="time"
                                                        disabled={!day.isOpen}
                                                        value={day.closeTime}
                                                        onChange={(e) => {
                                                            const newHours = [...hours];
                                                            newHours[idx].closeTime = e.target.value;
                                                            setHours(newHours);
                                                        }}
                                                        className={`border-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none ${day.isOpen ? 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white' : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Estado</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newHours = [...hours];
                                                        newHours[idx].isOpen = !newHours[idx].isOpen;
                                                        setHours(newHours);
                                                    }}
                                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${day.isOpen ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                                >
                                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${day.isOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end pt-4 border-t">
                                <button onClick={saveHours} disabled={hoursMutation.isPending} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 gap-2">
                                    <Save size={18} />
                                    {hoursMutation.isPending ? 'Guardando...' : 'Guardar Horarios'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div className="space-y-8">
                            {/* Formulario para Agregar/Editar */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    {isEditingPayment ? <Edit2 size={18} /> : <Plus size={18} />}
                                    {isEditingPayment ? 'Editar Método de Pago' : 'Agregar Nuevo Método de Pago'}
                                </h3>
                                <form onSubmit={handlePaymentSubmit} className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tipo de Pago</label>
                                        <select
                                            value={paymentForm.type}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                        >
                                            {PAYMENT_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Etiqueta (Ej. Cta Personal, Pago Móvil Banesco)</label>
                                        <input
                                            type="text"
                                            value={paymentForm.label}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, label: e.target.value })}
                                            placeholder="Nombre identificador"
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre del Titular</label>
                                        <input
                                            type="text"
                                            value={paymentForm.ownerName}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, ownerName: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cédula / RIF</label>
                                        <input
                                            type="text"
                                            value={paymentForm.ownerId}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, ownerId: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                        />
                                    </div>

                                    {(paymentForm.type === 'PAGO_MOVIL' || paymentForm.type === 'TRANSFERENCIA') && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Banco</label>
                                                <input
                                                    type="text"
                                                    value={paymentForm.bankName}
                                                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                                                    placeholder="Ej. Banesco, Mercantil"
                                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                                    required
                                                />
                                            </div>
                                            {paymentForm.type === 'TRANSFERENCIA' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Número de Cuenta</label>
                                                    <input
                                                        type="text"
                                                        value={paymentForm.accountNumber}
                                                        onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                                                        placeholder="20 dígitos"
                                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {paymentForm.type === 'PAGO_MOVIL' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        value={paymentForm.phoneNumber}
                                                        onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {paymentForm.type === 'ZELLE' && (
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium">Correo Electrónico (Zelle)</label>
                                            <input
                                                type="email"
                                                value={paymentForm.email}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, email: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                        {isEditingPayment && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingPayment(null);
                                                    setPaymentForm({
                                                        type: 'PAGO_MOVIL', label: '', ownerName: '', ownerId: '',
                                                        bankName: '', accountNumber: '', phoneNumber: '', email: '', isActive: true
                                                    });
                                                }}
                                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                        <button type="submit" disabled={paymentMutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                                            {isEditingPayment ? <Save size={16} /> : <Plus size={16} />}
                                            {paymentMutation.isPending ? 'Cargando...' : isEditingPayment ? 'Actualizar' : 'Agregar Método'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Lista de Métodos */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Mis Métodos de Pago</h3>
                                {!businessData?.rest?.paymentMethods || businessData.rest.paymentMethods.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No tienes métodos de pago registrados.</p>
                                ) : (
                                    <div className="grid gap-3">
                                        {businessData.rest.paymentMethods.map((method) => (
                                            <div key={method.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-600">
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{method.label}</h4>
                                                        <p className="text-xs text-gray-500">{method.type.replace('_', ' ')} • {method.ownerName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingPayment(method.id);
                                                            setPaymentForm({
                                                                type: method.type,
                                                                label: method.label,
                                                                ownerName: method.ownerName,
                                                                ownerId: method.ownerId || '',
                                                                bankName: method.bankName || '',
                                                                accountNumber: method.accountNumber || '',
                                                                phoneNumber: method.phoneNumber || '',
                                                                email: method.email || '',
                                                                isActive: method.isActive
                                                            });
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePayment(method.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 p-4 rounded-xl flex gap-3">
                <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    Asegúrate de guardar los cambios en cada pestaña. La información de horarios y métodos de pago es crucial para que tus clientes puedan realizar pedidos correctamente.
                </p>
            </div>
        </div>
    )
}
