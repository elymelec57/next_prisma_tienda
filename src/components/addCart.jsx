'use client'

import { Plus, Check } from 'lucide-react';
import { useAppDispatch } from "@/lib/hooks";
import { addCart } from "@/lib/features/cart/orderSlice";
import { useState } from "react";

export default function AddCart({ id, name, price, contornos }) {
    const dispatch = useAppDispatch();
    const [isAdding, setIsAdding] = useState(false);

    function add() {
        setIsAdding(true);
        const product = {
            id,
            name,
            price,
            count: 1,
            contornos,
            selectedContornos: []
        }
        dispatch(addCart(product));
        setTimeout(() => setIsAdding(false), 500);
    }

    return (
        <button
            type="button"
            onClick={add}
            className={`
                relative w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300
                ${isAdding
                    ? 'bg-green-600 scale-95'
                    : 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/25 hover:-translate-y-0.5'
                }
            `}
        >
            {isAdding ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAdding ? 'Agregado' : 'Agregar al carrito'}
        </button>
    )
}
