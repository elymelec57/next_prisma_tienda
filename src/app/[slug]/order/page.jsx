'use client'

import { FaPlus, FaMinus } from "react-icons/fa";
import { FiXSquare } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { sumarProduct, restarProduct, subCart, reset, updateContornos } from "@/lib/features/cart/orderSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function Buy() {
    const dispatch = useAppDispatch()
    const params = useParams()
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        comprobante: '',
        slug: params.slug,
        total: 0,
        order: {}
    });

    const [editingProduct, setEditingProduct] = useState(null); // State for the product being edited
    // tempSelectedContornos will be an array of arrays: [ [contornoId1, contornoId2], [contornoId1], ... ]
    // Each index corresponds to a unit of the product.
    const [tempSelectedContornos, setTempSelectedContornos] = useState([]);

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onFileChange = (e) => {
        let files = e.target.files[0];
        setForm({
            ...form,
            comprobante: files,
        })
    }

    const order = useAppSelector((state) => state.order.order)
    const count = useAppSelector((state) => state.order.count)

    function sumar(id) {
        dispatch(sumarProduct(id))
    }

    function restar(id) {
        dispatch(restarProduct(id))
    }

    function deleteP(id) {
        dispatch(subCart(id))
    }

    function openEditModal(product) {
        setEditingProduct(product);

        const count = product.count;
        let currentSelection = [];

        // Check if we have a valid array-of-arrays structure
        if (Array.isArray(product.selectedContornos) && product.selectedContornos.length > 0 && Array.isArray(product.selectedContornos[0])) {
            currentSelection = [...product.selectedContornos];
        }

        // Adjust length to match current count
        if (currentSelection.length > count) {
            currentSelection = currentSelection.slice(0, count);
        } else {
            // Fill missing slots with DEFAULT (All Contornos)
            // Use available contornos or empty if none
            const allContornoIds = product.contornos ? product.contornos.map(c => c.id.toString()) : [];

            while (currentSelection.length < count) {
                currentSelection.push([...allContornoIds]);
            }
        }

        setTempSelectedContornos(currentSelection);
    }

    function closeEditModal() {
        setEditingProduct(null);
        setTempSelectedContornos([]);
    }

    function toggleContornoForUnit(unitIndex, contornoId) {
        setTempSelectedContornos(prev => {
            const newSelection = [...prev];
            // Ensure the inner array exists (just in case)
            if (!newSelection[unitIndex]) newSelection[unitIndex] = [];

            const unitContornos = newSelection[unitIndex];
            const idStr = contornoId.toString();

            if (unitContornos.includes(idStr)) {
                newSelection[unitIndex] = unitContornos.filter(id => id !== idStr);
            } else {
                newSelection[unitIndex] = [...unitContornos, idStr];
            }
            return newSelection;
        });
    }

    function saveContornos() {
        if (editingProduct) {
            dispatch(updateContornos({ id: editingProduct.id, selectedContornos: tempSelectedContornos }));
            closeEditModal();
        }
    }

    const total = () => {
        let total = 0
        order.forEach(element => {
            total = Number(total) + Number(element.price) * element.count
        });
        form.total = total
        return total
    }

    const buy = async (e) => {
        e.preventDefault()
        form.order = order

        // Create a basic payment object or handle file upload if enabled later
        const newPago = { pathname: 'pending_payment_proof' };

        if (newPago.pathname) {
            const OrderSolicitud = await fetch('/api/buy/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ form, pago: newPago.pathname })
            })

            const res = await OrderSolicitud.json()
            if (res.status) {
                alert(res.message)

                dispatch(reset())
                localStorage.removeItem('order');
                localStorage.removeItem('count');
                router.push(`/${params.slug}`)

            } else {
                alert(res.message)
            }
        } else {
            alert('Error al procesar el pago')
        }
    }

    // Helper to generate a summary string for display
    const getSummary = (item) => {
        if (!item.selectedContornos || !Array.isArray(item.selectedContornos) || !Array.isArray(item.selectedContornos[0])) {
            return null;
        }

        // We need to sync with current count just for display safety
        const relevantSelection = item.selectedContornos.slice(0, item.count);
        // If count increased but selection wasn't updated via modal, those new units have "All" effectively, but here we might just show what we have or nothing for new ones.
        // Actually best to show "Default" for unconfigured ones?
        // Let's just iterate what we have.

        // Grouping logic for display
        const counts = {}; // { "Arroz, Ensalada": 2, "Arroz": 1 }

        for (let i = 0; i < item.count; i++) {
            // If we don't have config for this unit (e.g. user increased quantity but didn't open modal), assume ALL.
            let ids = [];
            if (i < relevantSelection.length) {
                ids = relevantSelection[i];
            } else {
                ids = item.contornos ? item.contornos.map(c => c.id.toString()) : [];
            }

            const names = ids.map(id => {
                const c = item.contornos?.find(cx => cx.id.toString() === id);
                return c ? c.nombre : null;
            }).filter(Boolean).join(', ');

            const key = names || "Sin Contornos";
            counts[key] = (counts[key] || 0) + 1;
        }

        return Object.entries(counts).map(([names, qty]) => (
            <span key={names} className="block">• {qty}x [{names}]</span>
        ));
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center font-bold uppercase p-4 cursor-pointer"><Link href={`/${params.slug}`}>{params.slug}</Link></h1>
            </div>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3">
                    <div className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {order.length === 0 ? (
                            <p className="p-4 text-center text-gray-500 dark:text-gray-400">No hay productos en el carrito.</p>
                        ) : (
                            order.map((o) => (
                                <div key={o.id} className="block w-full px-4 py-2 text-gray-900 bg-white border-b border-gray-200 cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:text-white first:rounded-t-lg last:rounded-b-lg">
                                    <div className="flex flex-col sm:flex-row justify-between items-center">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="font-bold text-lg">{o.name} - {o.price}$</p>
                                            <p className="text-sm">Cantidad: {o.count}</p>

                                            {/* Display Distribution Summary */}
                                            {o.contornos && o.contornos.length > 0 && (
                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {getSummary(o)}
                                                </div>
                                            )}

                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-lg font-semibold">{o.price * o.count} $</div>
                                            <div className="flex items-center space-x-2">
                                                <button type="button" title="Sumar Producto" onClick={() => sumar(o.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                    <FaPlus className="text-green-500" />
                                                </button>
                                                {o.count > 0 ? (
                                                    <button type="button" title="Restar producto" onClick={() => restar(o.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        <FaMinus className="text-yellow-500" />
                                                    </button>
                                                ) : (
                                                    <button type="button" title="Eliminar del carrito" onClick={() => deleteP(o.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        <FiXSquare className="text-red-500 text-xl" />
                                                    </button>
                                                )}
                                                {o.contornos && o.contornos.length > 0 && (
                                                    <button type="button" title="Personalizar Unidades" onClick={() => openEditModal(o)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        <FaEdit className="text-blue-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {order.length > 0 && (
                        <p className="text-center p-4 text-lg font-semibold bg-white dark:bg-gray-700 rounded-b-lg shadow-md">
                            Cantidad: <span className="font-bold">{count}</span> Total: <span className="font-bold">{total()}$</span>
                        </p>
                    )}
                    <div className="flex justify-center mt-4">
                        <Link href={`/${params.slug}`} className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors text-lg">Atras</Link>
                    </div>
                </div>
                {editingProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
                            <h3 className="text-xl font-bold mb-4 dark:text-white">Personalizar Unidades - {editingProduct.name}</h3>
                            <p className="text-sm mb-4 text-gray-500">Marque los contornos deseados para cada unidad.</p>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {tempSelectedContornos.map((unitSelection, index) => (
                                    <div key={index} className="mb-6 border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700">
                                        <h4 className="font-bold text-md mb-2 dark:text-gray-200">Unidad #{index + 1}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {editingProduct.contornos.map((contorno) => (
                                                <div key={contorno.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`u${index}-c${contorno.id}`}
                                                        checked={unitSelection.includes(contorno.id.toString())}
                                                        onChange={() => toggleContornoForUnit(index, contorno.id)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label htmlFor={`u${index}-c${contorno.id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        {contorno.nombre}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-2 border-t dark:border-gray-700">
                                <button onClick={closeEditModal} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancelar</button>
                                <button onClick={saveContornos} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                    <h2 className="text-center text-2xl font-bold mb-4">Formulario de Pago</h2>
                    <form onSubmit={buy} className="w-full">
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                            <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Tu nombre" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" id="email" name="email" value={form.email} onChange={changeImput} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="nombre@ejemplo.com" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                            <input type="text" id="phone" name="phone" onChange={changeImput} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Ej: +58 412-1234567" required />
                        </div>

                        <div className="flex justify-center">
                            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors text-lg">Comprar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
