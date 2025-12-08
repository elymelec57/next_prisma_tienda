import React from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, productName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirmar Eliminación</h2>
                <p className="text-gray-700 mb-6">
                    ¿Estás seguro de que quieres eliminar el producto <span className="font-bold">{productName}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus://ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}