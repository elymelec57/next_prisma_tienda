'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function IngredientList({ onEdit, onDelete }) {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    async function fetchIngredients() {
      const res = await fetch('/api/ingredients')
      const data = await res.json()
      setIngredients(data)
    }
    fetchIngredients()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ingredients.map((ingredient) => (
        <Card key={ingredient.id} className="p-4">
          <h3 className="text-lg font-bold">{ingredient.nombre}</h3>
          <p>SKU: {ingredient.sku}</p>
          <p>Categoría: {ingredient.categoria}</p>
          <p>Unidad de Medida: {ingredient.unidadMedida}</p>
          <p>Stock Actual: {ingredient.stockActual}</p>
          <p>Stock Mínimo: {ingredient.stockMinimo}</p>
          <p>Costo Unitario: ${ingredient.costoUnitario}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => onEdit(ingredient)}>Editar</Button>
            <Button onClick={() => onDelete(ingredient.id)} variant="danger">
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
