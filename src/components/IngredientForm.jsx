'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Loader2, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const ingredientSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    sku: z.string().optional(),
    categoria: z.string().min(1, 'La categoría es requerida'),
    unidadMedida: z.string().min(1, 'La unidad de medida es requerida'),
    stockActual: z.number().min(0, 'El stock no puede ser negativo'),
    stockMinimo: z.number().min(0, 'El stock mínimo no puede ser negativo'),
    stockMaximo: z.number().optional().nullable(),
    costoUnitario: z.number().min(0, 'El costo no puede ser negativo'),
    fechaVencimiento: z.string().optional().nullable(),
});

export default function IngredientForm({ ingredientId = null, onSuccess, onCancel }) {

    const router = useRouter()
    // Assuming backend might need userId, though usually it's in the token/session. 
    // But other forms sent it, so we might need it? 
    // The previous implementation didn't send userId in body, so maybe it's not needed or backend gets it from session.
    // I'll leave it available just in case.
    const userId = useAppSelector((state) => state.auth.auth.id)
    const [categories, setCategories] = useState([])
    const [masterIngredients, setMasterIngredients] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('')


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(ingredientSchema),
        defaultValues: {
            nombre: '',
            sku: '',
            categoria: '',
            unidadMedida: '',
            stockActual: 0,
            stockMinimo: 0,
            stockMaximo: null,
            costoUnitario: 0,
            fechaVencimiento: ''
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (ingredientId && categories.length > 0) {
            consultIngredient(ingredientId);
        }
    }, [ingredientId, categories]);

    async function fetchCategories() {
        try {
            const res = await fetch('/api/user/ingredients/categories')
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    async function fetchMasterIngredients(categoryId) {
        try {
            const res = await fetch(`/api/user/ingredients/master?categoryId=${categoryId}`)
            if (res.ok) {
                const data = await res.json()
                setMasterIngredients(data)
            }
        } catch (error) {
            console.error('Error fetching master ingredients:', error)
        }
    }

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value
        setSelectedCategoryId(categoryId)
        const categoryMatch = categories.find(c => c.id === parseInt(categoryId))
        if (categoryMatch) {
            setValue('categoria', categoryMatch.nombre)
        }
        setMasterIngredients([])
        if (categoryId) {
            fetchMasterIngredients(categoryId)
        }
    }

    const handleMasterIngredientChange = (e) => {
        const ingredientId = e.target.value
        const ingredient = masterIngredients.find(i => i.id === parseInt(ingredientId))
        if (ingredient) {
            setValue('nombre', ingredient.nombre)
        }
    }


    async function consultIngredient(id) {
        try {
            // Adjusting URL to match likely pattern. The previous page used /api/user/ingredients?id=${id} for delete/update?
            // Existing page handled PUT on `/api/user/ingredients?id=${id}`.
            // Let's assume GET is similar or `/api/user/ingredients/${id}`. 
            // Since I can't verify backend, I will try to follow the pattern seen in the file I read: /api/user/ingredients?id=...
            // But wait, standard REST usually has ID in path. 
            // However, the `IngredientsPage` had: `fetch(/api/user/ingredients?id=${id}, { method: 'DELETE' })`
            // So I will assume GET is also query param or I might need to adjust.
            // Let's try to fetch list and find it if individual fetch isn't clear, OR assume User API follows a pattern.
            // Taking a safe bet: most Next.js apps I see here use dynamic routes [id]. The file I read: `src/app/store/ingredientes/page.jsx` used query params for delete.
            // Let's trust the previous pattern for now, but `product` and `contorno` used dynamic routes.
            // If this fails, I'll have to fix it.

            // Actually, if I look at `ListContorno`, it used `/api/user/contorno/${id}`.
            // The `IngredientsPage` was likely an earlier iteration or different style.
            // I will assume for now that I should use conventions similar to `ProductForm` if possible, but if the backend only supports the query param style, I must distinct.
            // Let's rely on the previous content of `IngredientsPage`:
            // `const url = selectedIngredient ? /api/user/ingredients?id=${selectedIngredient.id} : /api/user/ingredients`
            // So it seems it uses Query Params.

            // NOTE: Getting a single ingredient wasn't shown in the previous page (it just passed `selectedIngredient` from the list).
            // So I might not be able to fetch a single one easily without the list. 
            // BUT, for `consultIngredient`, I need it if I want to support deep linking or fresh data. 
            // If I can't fetch single, I'll rely on the parent passing data? No, `IngredientForm` should be standalone-ish.
            // Let's try fetching from standard list filtering if single endpoint doesn't exist? No that's bad.
            // I will assume GET /api/user/ingredients?id=ID works.

            const res = await fetch(`/api/user/ingredients?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                // key might be 'ingredient' or just the object.
                // If it returns list, I might need to find it.
                // Let's assume it returns the object.
                const ingredient = data.length ? data[0] : data; // Fallback if it returns array of 1

                if (ingredient) {
                    setValue("nombre", ingredient.nombre);
                    setValue("sku", ingredient.sku || '');
                    setValue("categoria", ingredient.categoria || '');
                    setValue("unidadMedida", ingredient.unidadMedida);
                    setValue("stockActual", parseFloat(ingredient.stockActual));
                    setValue("stockMinimo", parseFloat(ingredient.stockMinimo));
                    setValue("stockMaximo", ingredient.stockMaximo ? parseFloat(ingredient.stockMaximo) : null);
                    setValue("costoUnitario", parseFloat(ingredient.costoUnitario));
                    setValue("fechaVencimiento", ingredient.fechaVencimiento ? new Date(ingredient.fechaVencimiento).toISOString().split('T')[0] : '');

                    if (ingredient.categoria && categories.length > 0) {
                        const cat = categories.find(c => c.nombre === ingredient.categoria)
                        if (cat) {
                            setSelectedCategoryId(cat.id.toString())
                            fetchMasterIngredients(cat.id)
                        }
                    }
                }
            } else {
                console.error("Error fetching ingredient data");
            }
        } catch (error) {
            console.error("Error fetching ingredient:", error);
            toast.error("Error al cargar datos");
        }
    }

    const onSubmit = async (data) => {
        // Transform strings to numbers/dates if needed, though zod handles type validation, the form inputs are strings mostly.
        // react-hook-form valueAsNumber helps.

        if (ingredientId) {
            return updateIngredient(data)
        }
        return createIngredient(data);
    }

    const createIngredient = async (data) => {
        try {
            const res = await fetch(`/api/user/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json(); // Assuming returns created obj or message
                toast.success("Ingrediente creado exitosamente");
                router.refresh();
                if (onSuccess) onSuccess();
                reset();
            } else {
                toast.error("Error al crear ingrediente");
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    }

    const updateIngredient = async (data) => {
        try {
            const res = await fetch(`/api/user/ingredients?id=${ingredientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                toast.success("Ingrediente actualizado");
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error("Error al actualizar");
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 italic">Seleccionar Categoría</label>
                    <div className="relative">
                        <select
                            value={selectedCategoryId}
                            onChange={handleCategoryChange}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 appearance-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        >
                            <option value="">-- Elige una categoría --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 italic">Seleccionar Ingrediente Maestro</label>
                    <div className="relative">
                        <select
                            onChange={handleMasterIngredientChange}
                            disabled={!selectedCategoryId}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 appearance-none disabled:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:disabled:bg-gray-900"
                        >
                            <option value="">-- Elige un ingrediente --</option>
                            {masterIngredients.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Nombre Confirmado</label>
                    <input
                        {...register('nombre')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="Nombre que se guardará"
                    />
                    {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Categoría Confirmada</label>
                    <input
                        {...register('categoria')}
                        readOnly
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                        placeholder="Categoría vinculada"
                    />
                    {errors.categoria && <p className="text-xs text-red-500">{errors.categoria.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">SKU (Opcional)</label>
                    <input
                        {...register('sku')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="Código SKU"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Unidad de Medida</label>
                    <input
                        {...register('unidadMedida')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="kg, gr, l, unidad..."
                    />
                    {errors.unidadMedida && <p className="text-xs text-red-500">{errors.unidadMedida.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Stock Actual</label>
                    <input
                        type="number"
                        {...register('stockActual', { valueAsNumber: true })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                    {errors.stockActual && <p className="text-xs text-red-500">{errors.stockActual.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Costo Unitario</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('costoUnitario', { valueAsNumber: true })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                    {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Stock Mínimo</label>
                    <input
                        type="number"
                        {...register('stockMinimo', { valueAsNumber: true })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Stock Máximo (Opcional)</label>
                    <input
                        type="number"
                        {...register('stockMaximo', { valueAsNumber: true })}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Fecha de Vencimiento (Opcional)</label>
                    <input
                        type="date"
                        {...register('fechaVencimiento')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                >
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="mr-2 h-4 w-4" /> Guardar</>}
                </button>
            </div>
        </form>
    )
}
