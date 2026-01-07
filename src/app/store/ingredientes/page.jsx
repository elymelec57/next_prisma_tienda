'use client'
import { useState, useEffect } from 'react'
import { IngredientList } from '@/components/ingredients/IngredientList'
import { IngredientForm } from '@/components/ingredients/IngredientForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState(null)

  async function fetchIngredients() {
    try {
      const res = await fetch('/api/user/ingredients')
      if (res.ok) {
        const data = await res.json()
        setIngredients(data)
      } else {
        console.error('Failed to fetch ingredients')
      }
    } catch (error) {
      console.error('An error occurred while fetching ingredients:', error)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      try {
        const res = await fetch(`/api/user/ingredients?id=${id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          fetchIngredients() // Refresh the list
        } else {
          console.error('Failed to delete ingredient')
        }
      } catch (error) {
        console.error('An error occurred while deleting the ingredient:', error)
      }
    }
  }

  const handleFormSubmit = async (data) => {
    const method = selectedIngredient ? 'PUT' : 'POST'
    const url = selectedIngredient
      ? `/api/user/ingredients?id=${selectedIngredient.id}`
      : '/api/user/ingredients'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setSelectedIngredient(null)
        fetchIngredients() // Refresh the list
      } else {
        console.error('Failed to save ingredient')
      }
    } catch (error) {
      console.error('An error occurred while saving the ingredient:', error)
    }
  }

  const openAddModal = () => {
    setSelectedIngredient(null)
    setIsModalOpen(true)
  }

  return (
    <div className="container mt-30 mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Ingredientes</h1>
        <Button onClick={openAddModal}>Agregar Ingrediente</Button>
      </div>

      <IngredientList onEdit={handleEdit} onDelete={handleDelete} key={ingredients.length} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedIngredient ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
            </h2>
            <IngredientForm
              onSubmit={handleFormSubmit}
              defaultValues={selectedIngredient}
            />
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="mt-4"
            >
              Cancelar
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
