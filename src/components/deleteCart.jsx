'use client'

import { Trash2 } from 'lucide-react';
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
            onClick={() => sub(id)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
        >
            <Trash2 className="h-4 w-4" />
            Quitar del pedido
        </button>
    )
}
