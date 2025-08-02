'use client'

import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { addCart } from "@/lib/features/cart/orderSlice";

export default function AddCart({ id, name, price }) {

    const dispatch = useAppDispatch();

    function add() {
        const product = {
            id,
            name,
            price,
            count: 1
        }
        dispatch(addCart(product))
    }

    return (
        <>
            <button type="button" title="Agregar Producto" onClick={()=>{
                add()
            }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <FaPlus />
            </button>
        </>
    )
}
