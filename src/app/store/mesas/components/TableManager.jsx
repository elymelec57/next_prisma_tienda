
'use client'
import { useState, useEffect } from 'react'
import QrCode from '@/components/ui/QrCode'

export default function TableManager () {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState(null)

  useEffect(() => {
    fetchMesas()
  }, [])

  const fetchMesas = async () => {
    try {
      const response = await fetch('/api/store/mesas')
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
    const url = selectedMesa ? `/api/store/mesas/${selectedMesa.id}` : '/api/store/mesas'

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

  const handleDeleteMesa = async (id) => {
    try {
      const response = await fetch(`/api/store/mesas/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la mesa')
      }

      fetchMesas()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Gestión de Mesas</h1>
        <button
          onClick={() => handleOpenModal()}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Agregar Mesa
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {mesas.map((mesa) => (
          <div key={mesa.id} className='bg-white rounded-lg shadow-md p-4'>
            <h2 className='text-lg font-bold'>Mesa {mesa.numero}</h2>
            <p>Capacidad: {mesa.capacidad}</p>
            <p>Estado: {mesa.estado}</p>
            <div className='mt-4 flex justify-between'>
              <button
                onClick={() => handleOpenModal(mesa)}
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteMesa(mesa.id)}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <MesaModal
          mesa={selectedMesa}
          onClose={handleCloseModal}
          onSave={handleSaveMesa}
        />
      )}
    </div>
  )
}

function MesaModal ({ mesa, onClose, onSave }) {
  const [formData, setFormData] = useState({
    numero: mesa?.numero || '',
    capacidad: mesa?.capacidad || '',
    estado: mesa?.estado || 'Libre',
    qrData: mesa?.qrData || { value: '', styles: {} }
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white rounded-lg p-8'>
        <h2 className='text-2xl font-bold mb-4'>
          {mesa ? 'Editar Mesa' : 'Agregar Mesa'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='numero' className='block text-gray-700 font-bold mb-2'>
              Número de Mesa
            </label>
            <input
              type='number'
              name='numero'
              id='numero'
              value={formData.numero}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='capacidad'
              className='block text-gray-700 font-bold mb-2'
            >
              Capacidad
            </label>
            <input
              type='number'
              name='capacidad'
              id='capacidad'
              value={formData.capacidad}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='estado' className='block text-gray-700 font-bold mb-2'>
              Estado
            </label>
            <select
              name='estado'
              id='estado'
              value={formData.estado}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value='Libre'>Libre</option>
              <option value='Ocupada'>Ocupada</option>
              <option value='Reservada'>Reservada</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 font-bold mb-2'>
              Código QR
            </label>
            <QrCodeEditor qrData={formData.qrData} onChange={handleQrChange} />
          </div>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function QrCodeEditor ({ qrData, onChange }) {
  const [value, setValue] = useState(qrData.value)
  const [styles, setStyles] = useState(qrData.styles)

  const handleStyleChange = (e) => {
    const { name, value } = e.target
    setStyles((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    onChange({ value, styles })
  }, [value, styles])

  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='URL o texto para el QR'
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      />
      <div className='mt-2'>
        <label>Color:</label>
        <input
          type='color'
          name='fgColor'
          value={styles.fgColor || '#000000'}
          onChange={handleStyleChange}
        />
        <label>Fondo:</label>
        <input
          type='color'
          name='bgColor'
          value={styles.bgColor || '#ffffff'}
          onChange={handleStyleChange}
        />
      </div>
      <div className='mt-4'>
        <QrCode value={value} options={styles} />
      </div>
    </div>
  )
}
