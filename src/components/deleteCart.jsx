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
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 w-full"
        >
            <FiXSquare className="mr-2" />
            Quitar
        </button>
    )
}
