
'use client'
import { useState, useEffect } from 'react'
import {
  Plus,
  Users,
  Edit2,
  Trash2,
  QrCode as QrIcon,
  Loader2,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import QrCode from '@/components/ui/QrCode'
import Modal from '@/components/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

export default function TableManager() {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState(null)
  const [mesaToDelete, setMesaToDelete] = useState(null)

  useEffect(() => {
    fetchMesas()
  }, [])

  const fetchMesas = async () => {
    try {
      const response = await fetch('/api/user/mesas')
      if (!response.ok) {
        throw new Error('Error al cargar las mesas')
      }
      const data = await response.json()
      setMesas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mesa = null) => {
    setSelectedMesa(mesa)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedMesa(null)
    setIsModalOpen(false)
  }

  const handleSaveMesa = async (mesaData) => {
    const method = selectedMesa ? 'PUT' : 'POST'
    const url = selectedMesa ? `/api/user/mesas/${selectedMesa.id}` : '/api/user/mesas'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mesaData)
      })

      if (!response.ok) {
        throw new Error('Error al guardar la mesa')
      }

      fetchMesas()
      handleCloseModal()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteClick = (mesa) => {
    setMesaToDelete(mesa)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!mesaToDelete) return

    try {
      const response = await fetch(`/api/user/mesas/${mesaToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la mesa')
      }

      fetchMesas()
      setIsDeleteModalOpen(false)
      setMesaToDelete(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusBadge = (estado) => {
    const statuses = {
      'Libre': { color: 'bg-green-100 text-green-700 ring-green-600/20', icon: CheckCircle2 },
      'Ocupada': { color: 'bg-red-100 text-red-700 ring-red-600/20', icon: XCircle },
      'Reservada': { color: 'bg-amber-100 text-amber-700 ring-amber-600/20', icon: Clock },
    };

    const config = statuses[estado] || statuses['Libre'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.color}`}>
        <Icon className="mr-1 h-3.5 w-3.5" />
        {estado}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Cargando mesas...</p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>Gestión de Mesas</h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>
            Administra la disposición y disponibilidad de las mesas de tu establecimiento.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className='flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20'
        >
          <Plus className="h-5 w-5" />
          Agregar Mesa
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {mesas.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl dark:border-gray-800">
          <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No hay mesas registradas</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Comienza agregando tu primera mesa al sistema.</p>
          <Button onClick={() => handleOpenModal()} className="mx-auto">
            Agregar Mesa
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {mesas.map((mesa) => (
            <Card key={mesa.id} className="group relative overflow-hidden transition-all hover:shadow-xl border border-gray-100 dark:border-gray-800 p-0 bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                    <Users className="h-6 w-6" />
                  </div>
                  {getStatusBadge(mesa.estado)}
                </div>

                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  Mesa {mesa.numero}
                </h2>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    Capacidad: <span className="font-semibold text-gray-900 dark:text-gray-200">{mesa.capacidad} personas</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50/50 dark:bg-gray-900/50 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenModal(mesa)}
                  className='flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:text-sm font-bold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all active:scale-95 dark:bg-gray-900 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600/20'
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(mesa)}
                  className='flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:text-sm font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all active:scale-95 dark:bg-gray-900 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-600/20'
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Principal (Crear/Editar) */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedMesa ? `Editar Mesa ${selectedMesa.numero}` : 'Agregar Nueva Mesa'}
        >
          <MesaModal
            mesa={selectedMesa}
            onClose={handleCloseModal}
            onSave={handleSaveMesa}
          />
        </Modal>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Eliminación"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Estás seguro?</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Estás a punto de eliminar la <span className="font-bold text-gray-900 dark:text-white">Mesa {mesaToDelete?.numero}</span>. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Eliminar Mesa
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function MesaModal({ mesa, onClose, onSave }) {
  const [formData, setFormData] = useState({
    numero: mesa?.numero || '',
    capacidad: mesa?.capacidad || '',
    estado: mesa?.estado || 'Libre',
    qrData: mesa?.qrData ? (typeof mesa.qrData === 'string' ? JSON.parse(mesa.qrData) : mesa.qrData) : { value: '', styles: {} }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQrChange = (newQrData) => {
    setFormData((prev) => ({ ...prev, qrData: newQrData }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      numero: parseInt(formData.numero, 10),
      capacidad: parseInt(formData.capacidad, 10)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className='space-y-2'>
          <Label htmlFor='numero'>Número de Mesa</Label>
          <Input
            type='number'
            name='numero'
            id='numero'
            value={formData.numero}
            onChange={handleChange}
            placeholder="Ej: 5"
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='capacidad'>Capacidad (Personas)</Label>
          <Input
            type='number'
            name='capacidad'
            id='capacidad'
            value={formData.capacidad}
            onChange={handleChange}
            placeholder="Ej: 4"
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='estado'>Estado Inicial</Label>
        <select
          name='estado'
          id='estado'
          value={formData.estado}
          onChange={handleChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500'
        >
          <option value='Libre'>Libre</option>
          <option value='Ocupada'>Ocupada</option>
          <option value='Reservada'>Reservada</option>
        </select>
      </div>

      <div className='pt-4 border-t dark:border-gray-800'>
        <Label className="flex items-center gap-2 mb-4">
          <QrIcon className="h-4 w-4" />
          Configuración de Código QR
        </Label>
        <QrCodeEditor qrData={formData.qrData} onChange={handleQrChange} />
      </div>

      <div className='flex justify-end gap-3 pt-6 border-t dark:border-gray-800'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-950 dark:text-gray-300 dark:border-gray-700'
        >
          Cancelar
        </button>
        <Button
          type='submit'
          className="!w-auto px-8"
        >
          {mesa ? 'Actualizar Mesa' : 'Guardar Mesa'}
        </Button>
      </div>
    </form>
  )
}

function QrCodeEditor({ qrData, onChange }) {
  const [value, setValue] = useState(qrData.value || '')
  const [styles, setStyles] = useState(qrData.styles || { fgColor: '#000000', bgColor: '#ffffff' })

  const handleStyleChange = (e) => {
    const { name, value } = e.target
    setStyles((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    onChange({ value, styles })
  }, [value, styles])

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-url" className="text-xs">URL o Contenido del QR</Label>
        <Input
          id="qr-url"
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='https://tu-tienda.com/menu?mesa=1'
          className="bg-white dark:bg-gray-950"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Label className="text-xs mb-0">Color QR:</Label>
          <input
            type='color'
            name='fgColor'
            value={styles.fgColor || '#000000'}
            onChange={handleStyleChange}
            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs mb-0">Fondo:</Label>
          <input
            type='color'
            name='bgColor'
            value={styles.bgColor || '#ffffff'}
            onChange={handleStyleChange}
            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
      </div>

      <div className='flex justify-center p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800'>
        <QrCode value={value || ' '} options={styles} />
      </div>
    </div>
  )
}
