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
        <>
            <button type="button" title="Quitar Producto" onClick={()=>{
                sub(id)
            }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <FiXSquare />
            </button>
        </>
    )
}
