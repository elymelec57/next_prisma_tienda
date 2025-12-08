'use client'
import ButtomEdit from '@/components/buttomEdit';
import Link from 'next/link';
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function ListProduct() {

    const params = useParams()
    const id = useAppSelector((state) => state.auth.auth.id)
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [productToDelete, setProductToDelete] = useState(null); // State to hold product to delete

    useEffect(() => {
        platos();
    }, [])

    const platos = async () => {
        let res = ''
        if (params.id) {
            res = await fetch(`/api/product/user/${params.id}`)
        } else {
            res = await fetch(`/api/product/user/${id}`)
        }

        const { dataPlatos } = await res.json()

        setProduct(dataPlatos);
        setLoading(false);
    }

    const handleDeleteClick = (p) => {
        setProductToDelete(p);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsModalOpen(false);
        if (!productToDelete) return;

        const id = productToDelete.id;
        const res = await fetch(`/api/product/${id}`, {
            method: 'DELETE'
        })

        const eliminado = await res.json()
        if (eliminado.status) {
            setLoading(true)
            platos()
            toast.success(eliminado.message);
        } else {
            toast.error(eliminado.message);
        }

        setProductToDelete(null); // Clear product after deletion attempt
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };
 
    if (loading) {
        return <div className='container mx-auto mt-20'>Cargando...</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Lista de platos</h1>
            <div className="mb-6">
                <Link href={'/store/plato/new'} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Nuevo Producto
                </Link>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Imagen
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Descripción
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Precio
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.map((p) => (
                                <tr key={p.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        {p.mainImage && <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`} className="w-16 h-16 object-cover rounded-full border border-gray-200" alt="" />}
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {p.nombre}
                                    </th>
                                    <td className="px-6 py-4">
                                        {p.descripcion}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        ${p.precio}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.disponible ? 'Disponible' : 'No Disponible'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center space-x-3">
                                        <ButtomEdit path='/store/plato/' id={p.id} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition ease-in-out duration-150">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z"></path></svg>
                                            Editar
                                        </ButtomEdit>
                                        <button type="button" onClick={() => handleDeleteClick(p)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd"></path></svg>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                productName={productToDelete?.nombre}
            />
        </div>
    )
}
