'use client'

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Camera, Save, RefreshCw, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">Cargando mapa...</div>
});

export default function GeneralTab({ userId, businessData }) {
    const queryClient = useQueryClient();

    const [showImg, setShowImg] = useState(true)
    const [image, setImage] = useState({
        mainImageId: null,
        url: '',
        image: ''
    })
    const [imagePreview, setImagePreview] = useState(null);

    const [form, setForm] = useState({
        id: '',
        name: '',
        slogan: '',
        phone: '',
        direcction: '',
        slug: '',
        currency: 'USD',
        categoriaRestaurant: [],
        lat: null,
        lng: null,
        deliveryFreeRange: '',
        deliveryShortRange: '',
        deliveryShortPrice: '',
        deliveryMediumRange: '',
        deliveryMediumPrice: '',
        deliveryLongRange: '',
        deliveryLongPrice: '',
        countryId: '',
        stateId: '',
        cityId: '',
    });

    const { data: allCategories } = useQuery({
        queryKey: ['allRestaurantCategories'],
        queryFn: async () => {
            const res = await fetch('/api/admin/categoria-restaurant');
            const data = await res.json();
            return data.categorias || [];
        },
    });

    const { data: locationsData } = useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const res = await fetch('/api/locations');
            const data = await res.json();
            return data.data || [];
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
                categoriaRestaurant: rest.categoriaRestaurant?.map(c => c.id) || [],
                lat: rest.lat,
                lng: rest.lng,
                deliveryFreeRange: rest.deliveryFreeRange || '',
                deliveryShortRange: rest.deliveryShortRange || '',
                deliveryShortPrice: rest.deliveryShortPrice || '',
                deliveryMediumRange: rest.deliveryMediumRange || '',
                deliveryMediumPrice: rest.deliveryMediumPrice || '',
                deliveryLongRange: rest.deliveryLongRange || '',
                deliveryLongPrice: rest.deliveryLongPrice || '',
                countryId: rest.countryId || '',
                stateId: rest.stateId || '',
                cityId: rest.cityId || '',
            })

            setImage({
                mainImageId: rest.mainImageId,
                url: rest.url,
                image: ''
            })
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

    const businessMutation = useMutation({
        mutationFn: async () => {
            if (!form.id) {
                const formData = new FormData();
                formData.append('form', JSON.stringify({ form }));
                if (image.image) {
                    formData.append('image', image.image);
                }
                const storeBusiness = await fetch(`/api/user/business`, {
                    method: 'POST',
                    body: formData,
                });
                const rest = await storeBusiness.json()
                return rest;
            } else {
                const formData = new FormData();
                formData.append('form', JSON.stringify({ form }));
                formData.append('mainImageId', image.mainImageId);
                if (image.image) {
                    formData.append('image', image.image);
                }

                const updateBusiness = await fetch(`/api/user/business/user/${userId}`, {
                    method: 'PUT',
                    body: formData,
                });

                const rest = await updateBusiness.json()
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

    return (
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

                <div className="space-y-2">
                    <label className="text-sm font-medium">País</label>
                    <select
                        name="countryId"
                        value={form.countryId}
                        onChange={(e) => setForm({ ...form, countryId: parseInt(e.target.value), stateId: '', cityId: '' })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        required
                    >
                        <option value="">Selecciona un país</option>
                        {locationsData?.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Estado / Provincia</label>
                    <select
                        name="stateId"
                        value={form.stateId}
                        onChange={(e) => setForm({ ...form, stateId: parseInt(e.target.value), cityId: '' })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        disabled={!form.countryId}
                        required
                    >
                        <option value="">Selecciona un estado</option>
                        {locationsData?.find(c => c.id === form.countryId)?.states?.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Ciudad</label>
                    <select
                        name="cityId"
                        value={form.cityId}
                        onChange={(e) => setForm({ ...form, cityId: parseInt(e.target.value) })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        disabled={!form.stateId}
                        required
                    >
                        <option value="">Selecciona una ciudad</option>
                        {locationsData?.find(c => c.id === form.countryId)
                            ?.states?.find(s => s.id === form.stateId)
                            ?.cities?.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                    </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin size={16} className="text-red-500" />
                        Ubicación en el Mapa
                    </label>
                    <MapPicker
                        lat={form.lat}
                        lng={form.lng}
                        onChange={(lat, lng) => setForm({ ...form, lat, lng })}
                    />
                    <p className="text-[11px] text-gray-500">Marca la ubicación exacta de tu negocio para cálculos de delivery.</p>
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
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.categoriaRestaurant.includes(cat.id)
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
    )
}
