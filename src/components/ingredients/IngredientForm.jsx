'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

const ingredientSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  sku: z.string().optional(),
  categoria: z.string(),
  unidadMedida: z.string(),
  stockActual: z.number().min(0, 'El stock no puede ser negativo'),
  stockMinimo: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  stockMaximo: z.number().optional(),
  costoUnitario: z.number().min(0, 'El costo no puede ser negativo'),
  fechaVencimiento: z.string().optional(),
})

export function IngredientForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ingredientSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" {...register('nombre')} />
        {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
      </div>
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" {...register('sku')} />
      </div>
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Input id="categoria" {...register('categoria')} />
        {errors.categoria && <p className="text-red-500">{errors.categoria.message}</p>}
      </div>
      <div>
        <Label htmlFor="unidadMedida">Unidad de Medida</Label>
        <Input id="unidadMedida" {...register('unidadMedida')} />
        {errors.unidadMedida && <p className="text-red-500">{errors.unidadMedida.message}</p>}
      </div>
      <div>
        <Label htmlFor="stockActual">Stock Actual</Label>
        <Input id="stockActual" type="number" {...register('stockActual', { valueAsNumber: true })} />
        {errors.stockActual && <p className="text-red-500">{errors.stockActual.message}</p>}
      </div>
      <div>
        <Label htmlFor="stockMinimo">Stock Mínimo</Label>
        <Input id="stockMinimo" type="number" {...register('stockMinimo', { valueAsNumber: true })} />
        {errors.stockMinimo && <p className="text-red-500">{errors.stockMinimo.message}</p>}
      </div>
      <div>
        <Label htmlFor="stockMaximo">Stock Máximo</Label>
        <Input id="stockMaximo" type="number" {...register('stockMaximo', { valueAsNumber: true })} />
      </div>
      <div>
        <Label htmlFor="costoUnitario">Costo Unitario</Label>
        <Input id="costoUnitario" type="number" step="0.01" {...register('costoUnitario', { valueAsNumber: true })} />
        {errors.costoUnitario && <p className="text-red-500">{errors.costoUnitario.message}</p>}
      </div>
      <div>
        <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
        <Input id="fechaVencimiento" type="date" {...register('fechaVencimiento')} />
      </div>
      <Button type="submit">Guardar</Button>
    </form>
  )
}
