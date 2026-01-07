'use client'

import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { addCart } from "@/lib/features/cart/orderSlice";
import { useState } from "react"; // Import useState

export default function AddCart({ id, name, price, contornos }) {
    const dispatch = useAppDispatch();
    const [isAdding, setIsAdding] = useState(false); // State for visual feedback

    function add() {
        setIsAdding(true); // Set state to indicate adding
        const product = {
            id,
            name,
            price,
            count: 1,
            contornos,
            selectedContornos: []
        }
        dispatch(addCart(product));
        setTimeout(() => setIsAdding(false), 500); // Reset state after 500ms
    }

    return (
        <button
            type="button"
            title="Agregar Producto"
            onClick={add}
            className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-300 ease-in-out
                ${isAdding
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                }
                focus:outline-none w-full`}
        >
            <FaPlus className="mr-2" />
            {isAdding ? 'Agregado!' : 'Agregar'}
        </button>
    )
}
