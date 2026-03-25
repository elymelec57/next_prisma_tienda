'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from "@/lib/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, Search, Loader2 } from 'lucide-react';

import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import ContornoForm from '@/components/ContornoForm';

export default function ListContorno() {

    const id = useAppSelector((state) => state.auth.auth.id)
    const queryClient = useQueryClient();

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [contornoToEdit, setContornoToEdit] = useState(null);
    const [contornoToDelete, setContornoToDelete] = useState(null);

    const { data: contornos = [], isLoading: loading } = useQuery({
        queryKey: ['contornos', id],
        queryFn: async () => {
            const res = await fetch(`/api/user/contornos/${id}`);
            if (!res.ok) throw new Error('Error al cargar contornos');
            const data = await res.json();
            return data.contornos || [];
        },
        enabled: !!id,
    });

    const handleEditClick = (c) => {
        setContornoToEdit(c);
        setIsCreateModalOpen(true);
    }

    const handleDeleteClick = (p) => {
        setContornoToDelete(p);
    };

    const deleteMutation = useMutation({
        mutationFn: async (contornoId) => {
            const res = await fetch(`/api/user/contornos/${contornoId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Error al eliminar contorno');
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['contornos', id] });
            } else {
                toast.error(data.message || "Error eliminando contorno");
            }
        },
        onError: () => {
            toast.error("Error al eliminar");
        },
        onSettled: () => {
            setContornoToDelete(null);
        }
    });

    const handleConfirmDelete = () => {
        if (!contornoToDelete) return;
        deleteMutation.mutate(contornoToDelete.id);
    };

    const handleCancelDelete = () => {
        setContornoToDelete(null);
    };

    const handleSuccess = () => {
        setIsCreateModalOpen(false);
        setContornoToEdit(null);
        queryClient.invalidateQueries({ queryKey: ['contornos', id] });
    }

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setContornoToEdit(null);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Contornos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gestiona los adicionales y acompañamientos de tus platos.
                    </p>
                </div>
                <button
                    onClick={() => { setContornoToEdit(null); setIsCreateModalOpen(true); }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Contorno
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Nombre
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Precio
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {contornos.length > 0 ? (
                                contornos.map((c) => (
                                    <tr key={c.id} className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                        <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                            {c.nombre}
                                        </td>
                                        <td className="p-4 align-middle text-gray-500 dark:text-gray-400">
                                            ${c.precio}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(c)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                                >
                                                    <Pencil className="h-4 w-4 text-gray-500" />
                                                    <span className="sr-only">Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(c)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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
                                    <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay contornos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating/Editing Contorno */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                title={contornoToEdit ? "Editar Contorno" : "Nuevo Contorno"}
            >
                <div className="mt-2">
                    <ContornoForm
                        contornoId={contornoToEdit?.id}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseModal}
                    />
                </div>
            </Modal>

            {/* Confirmation Modal for Deleting */}
            <DeleteConfirmationModal
                isOpen={!!contornoToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                productName={contornoToDelete?.nombre}
            />
        </div>
    )
}
