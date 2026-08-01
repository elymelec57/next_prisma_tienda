'use client'

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { CreditCard, Plus, Trash2, Edit2, Save } from "lucide-react";

const PAYMENT_TYPES = [
    { value: 'PAGO_MOVIL', label: 'Pago Móvil' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'ZELLE', label: 'Zelle' },
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'ZINLI', label: 'Zinli' },
    { value: 'PAYPAL', label: 'PayPal' }
];

export default function PaymentsTab({ userId, businessData }) {
    const queryClient = useQueryClient();

    const [isEditingPayment, setIsEditingPayment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        type: 'PAGO_MOVIL',
        label: '',
        ownerName: '',
        ownerId: '',
        bankName: '',
        accountNumber: '',
        phoneNumber: '',
        email: '',
        isActive: true
    });

    const paymentMutation = useMutation({
        mutationFn: async () => {
            const url = isEditingPayment
                ? `/api/user/business/payment-methods/${isEditingPayment}`
                : '/api/user/business/payment-methods';
            const method = isEditingPayment ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: businessData?.rest?.id,
                    paymentMethod: paymentForm
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(isEditingPayment ? "Método actualizado" : "Método agregado");
                setPaymentForm({
                    type: 'PAGO_MOVIL', label: '', ownerName: '', ownerId: '',
                    bankName: '', accountNumber: '', phoneNumber: '', email: '', isActive: true
                });
                setIsEditingPayment(null);
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al procesar pago");
        }
    });

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!businessData?.rest?.id) return toast.error("Crea tu negocio primero");
        paymentMutation.mutate();
    }

    const deletePaymentMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/user/business/payment-methods/${id}`, { method: 'DELETE' });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("Eliminado");
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al eliminar");
        }
    });

    const deletePayment = (id) => {
        if (!confirm("¿Eliminar este método de pago?")) return;
        deletePaymentMutation.mutate(id);
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {isEditingPayment ? <Edit2 size={18} /> : <Plus size={18} />}
                    {isEditingPayment ? 'Editar Método de Pago' : 'Agregar Nuevo Método de Pago'}
                </h3>
                <form onSubmit={handlePaymentSubmit} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Pago</label>
                        <select
                            value={paymentForm.type}
                            onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        >
                            {PAYMENT_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Etiqueta (Ej. Cta Personal, Pago Móvil Banesco)</label>
                        <input
                            type="text"
                            value={paymentForm.label}
                            onChange={(e) => setPaymentForm({ ...paymentForm, label: e.target.value })}
                            placeholder="Nombre identificador"
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre del Titular</label>
                        <input
                            type="text"
                            value={paymentForm.ownerName}
                            onChange={(e) => setPaymentForm({ ...paymentForm, ownerName: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cédula / RIF</label>
                        <input
                            type="text"
                            value={paymentForm.ownerId}
                            onChange={(e) => setPaymentForm({ ...paymentForm, ownerId: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        />
                    </div>

                    {(paymentForm.type === 'PAGO_MOVIL' || paymentForm.type === 'TRANSFERENCIA') && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Banco</label>
                                <input
                                    type="text"
                                    value={paymentForm.bankName}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                                    placeholder="Ej. Banesco, Mercantil"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                    required
                                />
                            </div>
                            {paymentForm.type === 'TRANSFERENCIA' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Número de Cuenta</label>
                                    <input
                                        type="text"
                                        value={paymentForm.accountNumber}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                                        placeholder="20 dígitos"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                        required
                                    />
                                </div>
                            )}
                            {paymentForm.type === 'PAGO_MOVIL' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <input
                                        type="text"
                                        value={paymentForm.phoneNumber}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {paymentForm.type === 'ZELLE' && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Correo Electrónico (Zelle)</label>
                            <input
                                type="email"
                                value={paymentForm.email}
                                onChange={(e) => setPaymentForm({ ...paymentForm, email: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                required
                            />
                        </div>
                    )}

                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        {isEditingPayment && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingPayment(null);
                                    setPaymentForm({
                                        type: 'PAGO_MOVIL', label: '', ownerName: '', ownerId: '',
                                        bankName: '', accountNumber: '', phoneNumber: '', email: '', isActive: true
                                    });
                                }}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}
                        <button type="submit" disabled={paymentMutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                            {isEditingPayment ? <Save size={16} /> : <Plus size={16} />}
                            {paymentMutation.isPending ? 'Cargando...' : isEditingPayment ? 'Actualizar' : 'Agregar Método'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Mis Métodos de Pago</h3>
                {!businessData?.rest?.paymentMethods || businessData.rest.paymentMethods.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No tienes métodos de pago registrados.</p>
                ) : (
                    <div className="grid gap-3">
                        {businessData.rest.paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-600">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{method.label}</h4>
                                        <p className="text-xs text-gray-500">{method.type.replace('_', ' ')} • {method.ownerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditingPayment(method.id);
                                            setPaymentForm({
                                                type: method.type,
                                                label: method.label,
                                                ownerName: method.ownerName,
                                                ownerId: method.ownerId || '',
                                                bankName: method.bankName || '',
                                                accountNumber: method.accountNumber || '',
                                                phoneNumber: method.phoneNumber || '',
                                                email: method.email || '',
                                                isActive: method.isActive
                                            });
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deletePayment(method.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
