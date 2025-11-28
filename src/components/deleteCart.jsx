'use client'

import { FiXSquare } from "react-icons/fi";
import { useAppDispatch } from "@/lib/hooks";
import { subCart } from "@/lib/features/cart/orderSlice";

export default function DeleteCart({ id }) {

    const dispatch = useAppDispatch();

    function sub(id) {
        dispatch(subCart(id))
    }

    return (
        <button
            type="button"
            title="Quitar Producto"
            onClick={() => sub(id)}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out
                bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800
                text-white w-auto"
        >
            <FiXSquare className="mr-2" />
            Quitar
        </button>
    )
}
