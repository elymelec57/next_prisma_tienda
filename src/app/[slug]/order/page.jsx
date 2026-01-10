'use client'

import { Plus, Minus, Trash2, Edit, ArrowLeft, Check, ShoppingBag, CreditCard, User, Mail, Phone as PhoneIcon, Landmark, Smartphone, Wallet, DollarSign } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { sumarProduct, restarProduct, subCart, reset, updateContornos } from "@/lib/features/cart/orderSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Buy() {
    const dispatch = useAppDispatch()
    const params = useParams()
    const router = useRouter()

    const [restaurant, setRestaurant] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        comprobante: '',
        slug: params.slug,
        total: 0,
        order: {},
        paymentMethodId: ''
    });

    useEffect(() => {
        fetchRestaurant();
    }, [params.slug]);

    const fetchRestaurant = async () => {
        try {
            const res = await fetch(`/api/restaurants/${params.slug}`);
            const data = await res.json();
            if (data.status) {
                setRestaurant(data.restaurant);
            }
        } catch (error) {
            console.error("Error fetching restaurant:", error);
        }
    }

    const [editingProduct, setEditingProduct] = useState(null);
    const [tempSelectedContornos, setTempSelectedContornos] = useState([]);

    const changeInput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handlePaymentSelect = (method) => {
        setSelectedPaymentMethod(method);
        setForm({
            ...form,
            paymentMethodId: method.id
        });
    }

    const orderList = useAppSelector((state) => state.order.order)
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

        if (Array.isArray(product.selectedContornos) && product.selectedContornos.length > 0 && Array.isArray(product.selectedContornos[0])) {
            currentSelection = [...product.selectedContornos];
        }

        if (currentSelection.length > count) {
            currentSelection = currentSelection.slice(0, count);
        } else {
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

    const calculateTotal = () => {
        let total = 0
        orderList.forEach(element => {
            total = Number(total) + Number(element.price) * element.count
        });
        form.total = total
        return total.toFixed(2)
    }

    const buy = async (e) => {
        e.preventDefault()
        if (!form.paymentMethodId) {
            alert("Por favor selecciona un método de pago");
            return;
        }

        setIsLoading(true);
        form.order = orderList

        try {
            const OrderSolicitud = await fetch('/api/buy/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form, pago: form.paymentMethodId })
            })

            const res = await OrderSolicitud.json()
            if (res.status) {
                alert("Pedido realizado con éxito!");
                dispatch(reset())
                localStorage.removeItem('order');
                localStorage.removeItem('count');
                router.push(`/${params.slug}`)
            } else {
                alert(res.message)
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Ocurrió un error al procesar el pedido.");
        } finally {
            setIsLoading(false);
        }
    }

    const getSummary = (item) => {
        if (!item.selectedContornos || !Array.isArray(item.selectedContornos) || !Array.isArray(item.selectedContornos[0])) {
            return null;
        }

        const relevantSelection = item.selectedContornos.slice(0, item.count);
        const counts = {};

        for (let i = 0; i < item.count; i++) {
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

            const key = names || "Sin extras";
            counts[key] = (counts[key] || 0) + 1;
        }

        return Object.entries(counts).map(([names, qty]) => (
            <div key={names} className="flex items-start gap-2 text-xs text-slate-500 mt-1">
                <span className="font-medium bg-slate-100 px-1.5 rounded text-slate-600">{qty}x</span>
                <span>{names}</span>
            </div>
        ));
    }

    const getPaymentIcon = (type) => {
        switch (type) {
            case 'PAGO_MOVIL': return <Smartphone className="h-5 w-5" />;
            case 'TRANSFERENCIA': return <Landmark className="h-5 w-5" />;
            case 'ZELLE': return <Wallet className="h-5 w-5" />;
            case 'EFECTIVO': return <DollarSign className="h-5 w-5" />;
            default: return <CreditCard className="h-5 w-5" />;
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link href={`/${params.slug}`} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium">
                        <ArrowLeft className="h-5 w-5" />
                        Volver al menú
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 hidden sm:block">Finalizar Pedido</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* COLUMNA IZQUIERDA: RESUMEN DE PRODUCTOS + PAGOS */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Tu Carrito</h2>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {orderList.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">
                                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No has agregado productos aún.</p>
                                        <Link href={`/${params.slug}`} className="mt-4 inline-block text-orange-600 font-bold hover:underline">
                                            Ir a comprar
                                        </Link>
                                    </div>
                                ) : (
                                    orderList.map((o) => (
                                        <div key={o.id} className="p-6 transition-colors hover:bg-slate-50/50">
                                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-lg text-slate-900">{o.name}</h3>
                                                        <span className="font-bold text-slate-900 sm:hidden">${(o.price * o.count).toFixed(2)}</span>
                                                    </div>
                                                    <p className="text-slate-500 text-sm mb-2">Precio unitario: ${parseFloat(o.price).toFixed(2)}</p>

                                                    {o.contornos && o.contornos.length > 0 && (
                                                        <div className="mt-2 pl-3 border-l-2 border-orange-100">
                                                            {getSummary(o)}
                                                            <button
                                                                onClick={() => openEditModal(o)}
                                                                className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                                Editar opciones
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                                                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                                        <button
                                                            onClick={o.count === 1 ? () => deleteP(o.id) : () => restar(o.id)}
                                                            className="p-1.5 rounded-md bg-white text-slate-600 shadow-sm hover:text-red-500 transition-colors disabled:opacity-50"
                                                        >
                                                            {o.count === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                                        </button>
                                                        <span className="font-bold text-slate-900 w-4 text-center">{o.count}</span>
                                                        <button
                                                            onClick={() => sumar(o.id)}
                                                            className="p-1.5 rounded-md bg-white text-slate-600 shadow-sm hover:text-green-600 transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right min-w-[80px] hidden sm:block">
                                                        <span className="block font-bold text-lg text-slate-900">${(o.price * o.count).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {orderList.length > 0 && (
                                <div className="p-6 bg-slate-50 border-t border-slate-200">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold text-slate-600">Total a Pagar</span>
                                        <span className="font-bold text-2xl text-slate-900">${calculateTotal()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN DE MÉTODOS DE PAGO */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Método de Pago</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-500 mb-4">Selecciona cómo deseas pagar tu pedido:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {restaurant?.paymentMethods?.length > 0 ? (
                                        restaurant.paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => handlePaymentSelect(method)}
                                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${form.paymentMethodId === method.id
                                                    ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50'
                                                    : 'border-slate-100 bg-white hover:border-blue-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`p-2 rounded-lg ${form.paymentMethodId === method.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        {getPaymentIcon(method.type)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{method.label}</h4>
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">{method.type.replace('_', ' ')}</span>
                                                    </div>
                                                    {form.paymentMethodId === method.id && (
                                                        <Check className="h-5 w-5 text-blue-500 ml-auto" />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-slate-500">No hay métodos de pago configurados.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Detalles del método seleccionado */}
                                {selectedPaymentMethod && (
                                    <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white animate-in slide-in-from-top-2 duration-300">
                                        <h5 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                                            <Check className="h-4 w-4" />
                                            Datos para el pago:
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                            <div className="space-y-1">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Titular</span>
                                                <p className="font-medium text-lg">{selectedPaymentMethod.ownerName}</p>
                                            </div>
                                            {selectedPaymentMethod.ownerId && (
                                                <div className="space-y-1">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">ID / RIF</span>
                                                    <p className="font-medium text-lg">{selectedPaymentMethod.ownerId}</p>
                                                </div>
                                            )}
                                            {selectedPaymentMethod.bankName && (
                                                <div className="space-y-1">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Banco</span>
                                                    <p className="font-medium text-lg text-blue-200">{selectedPaymentMethod.bankName}</p>
                                                </div>
                                            )}
                                            {selectedPaymentMethod.phoneNumber && (
                                                <div className="space-y-1">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Teléfono</span>
                                                    <p className="font-medium text-lg tracking-wider">{selectedPaymentMethod.phoneNumber}</p>
                                                </div>
                                            )}
                                            {selectedPaymentMethod.accountNumber && (
                                                <div className="col-span-1 md:col-span-2 space-y-1 mt-2 pt-2 border-t border-slate-800">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Número de Cuenta</span>
                                                    <p className="font-mono text-xl text-blue-100 break-all">{selectedPaymentMethod.accountNumber}</p>
                                                </div>
                                            )}
                                            {selectedPaymentMethod.email && (
                                                <div className="col-span-1 md:col-span-2 space-y-1">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Email</span>
                                                    <p className="font-medium text-lg">{selectedPaymentMethod.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: FORMULARIO */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <div className="mb-6 flex items-center gap-2 text-slate-900">
                                <User className="h-5 w-5 text-orange-600" />
                                <h2 className="text-xl font-bold">Datos del Cliente</h2>
                            </div>

                            <form onSubmit={buy} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={changeInput}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                            placeholder="Ej: Juan Pérez"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={changeInput}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                            placeholder="juan@ejemplo.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={changeInput}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                            placeholder="+58 412 123 4567"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-500 font-medium">Total:</span>
                                        <span className="text-2xl font-bold text-slate-900">${calculateTotal()}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={orderList.length === 0 || isLoading || !form.paymentMethodId}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-5 w-5" />
                                                Confirmar Pedido
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 mt-4 uppercase font-bold tracking-wider">
                                        Seguridad garantizada por Elymelec57
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL DE EDICIÓN (Mismo código anterior) */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900">Personalizar {editingProduct.name}</h3>
                            <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                                <Plus className="h-6 w-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <p className="text-sm text-slate-500 bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                                Selecciona los ingredientes que deseas <strong>incluir</strong> en cada unidad.
                            </p>

                            {tempSelectedContornos.map((unitSelection, index) => (
                                <div key={index} className="p-4 rounded-xl border border-slate-200 hover:border-orange-100 transition-colors">
                                    <h4 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wide">Plato #{index + 1}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {editingProduct.contornos.map((contorno) => {
                                            const isSelected = unitSelection.includes(contorno.id.toString());
                                            return (
                                                <label
                                                    key={contorno.id}
                                                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${isSelected
                                                        ? 'bg-orange-50 border-orange-200 text-orange-800 font-semibold'
                                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300'}`}>
                                                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => toggleContornoForUnit(index, contorno.id)}
                                                    />
                                                    <span className="text-sm">{contorno.nombre}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={closeEditModal}
                                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveContornos}
                                className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shadow-md hover:shadow-orange-500/20 transition-all"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
