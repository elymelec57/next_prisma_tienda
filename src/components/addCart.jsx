'use client'

import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { addCart } from "@/lib/features/cart/orderSlice";
import { useState } from "react"; // Import useState

export default function AddCart({ id, name, price }) {
    const dispatch = useAppDispatch();
    const [isAdding, setIsAdding] = useState(false); // State for visual feedback

    function add() {
        setIsAdding(true); // Set state to indicate adding
        const product = {
            id,
            name,
            price,
            count: 1
        }
        dispatch(addCart(product));
        setTimeout(() => setIsAdding(false), 500); // Reset state after 500ms
    }

    return (
        <button
            type="button"
            title="Agregar Producto"
            onClick={add}
            className={`relative flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out
                ${isAdding
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800' // Green when adding
                    : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}
                text-white focus:ring-4 focus:outline-none w-auto`} // Adjusted width
        >
            <FaPlus className="mr-2" />
            {isAdding ? 'Agregado!' : 'Agregar'}
        </button>
    )
}
