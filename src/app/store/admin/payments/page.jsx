'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { CreditCard, CheckCircle, XCircle, Info, ExternalLink } from "lucide-react";

export default function AdminPayments() {
    const queryClient = useQueryClient();

    const { data: payments, isLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await fetch('/api/admin/plan-payments');
            return res.json();
        }
    });

    const approveMutation = useMutation({
        mutationFn: async ({ id, action }) => {
            const res = await fetch(`/api/admin/plan-payments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
            } else {
                toast.error(data.message);
            }
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando pagos...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                    <CreditCard size={28} className="text-blue-600" />
                    Validación de Pagos de Suscripción
                </h1>
                <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Panel de Control</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Restaurante / Usuario</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Solicitado</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalles del Pago</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                    No hay solicitudes de pago pendientes por validar.
                                </td>
                            </tr>
                        ) : (
                            payments?.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{payment.subscription.restaurant.name}</div>
                                        <div className="text-xs text-gray-500">{payment.subscription.restaurant.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-blue-600">{payment.plan.name}</div>
                                        <div className="text-sm font-bold text-gray-900">${payment.amount}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 font-medium">{payment.paymentMethod}</div>
                                        <div className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block text-gray-600 mt-1">Ref: {payment.transactionId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                        <div className="text-[10px] text-gray-400">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => approveMutation.mutate({ id: payment.id, action: 'REJECT' })}
                                                disabled={approveMutation.isPending}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors title='Rechazar'"
                                            >
                                                <XCircle size={22} />
                                            </button>
                                            <button
                                                onClick={() => approveMutation.mutate({ id: payment.id, action: 'APPROVE' })}
                                                disabled={approveMutation.isPending}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors title='Aprobar'"
                                            >
                                                <CheckCircle size={22} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <Info className="text-blue-600 shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                    Al <strong>Aprobar</strong> un pago, el plan del restaurante se actualizará automáticamente y la suscripción pasará a estado <strong>ACTIVO</strong>. Se registrará la fecha de inicio del plan a partir de este momento.
                </p>
            </div>
        </div>
    );
}
