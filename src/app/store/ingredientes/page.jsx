'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash, Loader2, Package, Search } from 'lucide-react'

import Modal from '@/components/Modal'
import IngredientForm from '@/components/IngredientForm'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [ingredientToEdit, setIngredientToEdit] = useState(null)
  const [ingredientToDelete, setIngredientToDelete] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])


  async function fetchIngredients() {
    setLoading(true)
    try {
      const res = await fetch('/api/user/ingredients')
      if (res.ok) {
        const data = await res.json()
        setIngredients(data || [])
      } else {
        toast.error('Error al cargar ingredientes')
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/user/ingredients/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchIngredients()
    fetchCategories()
  }, [])

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ing.sku && ing.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || ing.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })


  const handleEdit = (ingredient) => {
    setIngredientToEdit(ingredient)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (ingredient) => {
    setIngredientToDelete(ingredient)
  }

  const handleConfirmDelete = async () => {
    if (!ingredientToDelete) return

    try {
      const res = await fetch(`/api/user/ingredients?id=${ingredientToDelete.id}`, {
        method: 'DELETE',
      })

      const result = await res.json()

      if (res.ok && result.status !== false) {
        toast.success(result.message || 'Ingrediente eliminado')
        fetchIngredients()
      } else {
        toast.error(result.message || 'Error al eliminar ingrediente')
      }
    } catch (error) {
      toast.error('Error al eliminar ingrediente')
    } finally {
      setIngredientToDelete(null)
    }
  }

  const handleFormSuccess = () => {
    setIsFormModalOpen(false)
    setIngredientToEdit(null)
    fetchIngredients()
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setIngredientToEdit(null)
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Ingredientes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Administra el inventario de insumos para tu cocina.
          </p>
        </div>
        <button
          onClick={() => { setIngredientToEdit(null); setIsFormModalOpen(true); }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Ingrediente
        </button>
      </div>

      {/* Filters section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>


      {/* Table section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Ingrediente</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Categoría</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Stock</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Costo</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 dark:text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2">Cargando ingredientes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                    <td className="p-4 align-middle">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{ingredient.nombre}</div>
                      {ingredient.sku && <div className="text-xs text-gray-500 uppercase">{ingredient.sku}</div>}
                    </td>
                    <td className="p-4 align-middle hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20">
                        {ingredient.categoria}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${ingredient.stockActual <= ingredient.stockMinimo ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {ingredient.stockActual} {ingredient.unidadMedida}
                        </span>
                        {ingredient.stockActual <= ingredient.stockMinimo && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Stock Crítico</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell text-gray-600 dark:text-gray-400">
                      ${ingredient.costoUnitario?.toFixed(2)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(ingredient)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ingredient)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300 mb-2" />
                      <p>No se encontraron ingredientes.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingredient Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={ingredientToEdit ? "Editar Ingrediente" : "Nuevo Ingrediente"}
      >
        <div className="mt-2 text-left">
          <IngredientForm
            ingredientId={ingredientToEdit?.id}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseFormModal}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!ingredientToDelete}
        onClose={() => setIngredientToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={ingredientToDelete?.nombre}
      />
    </div>
  )
}
