'use client'

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { CreditCard, Plus, Camera, CheckCircle2, RefreshCw } from "lucide-react";

export default function PlansTab({ userId }) {
    const queryClient = useQueryClient();

    const idpotenciaRef = useRef(null);
    const generateIdpotencia = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `idp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    };

    const [planToUpgrade, setPlanToUpgrade] = useState(null);
    const [upgradeForm, setUpgradeForm] = useState({
        paymentMethod: '',
        transactionId: '',
        receipt: null,
        selectedMethod: null
    });

    const { data: subscriptionData } = useQuery({
        queryKey: ['subscription', userId],
        queryFn: async () => {
            const res = await fetch('/api/user/business/subscription');
            return res.json();
        },
        enabled: !!userId,
    });
    console.log(subscriptionData);
    const { data: planPaymentsData } = useQuery({
        queryKey: ['planPayments', userId],
        queryFn: async () => {
            const res = await fetch('/api/user/business/plan-payments');
            return res.json();
        },
        enabled: !!userId,
    });

    const { data: systemPaymentMethods } = useQuery({
        queryKey: ['systemPaymentMethods'],
        queryFn: async () => {
            const res = await fetch('/api/user/system-payment-methods');
            return res.json();
        },
    });

    const subscribeMutation = useMutation({
        mutationFn: async ({ planId, paymentMethod, transactionId, idpotencia }) => {
            const formData = new FormData();
            formData.append('form', JSON.stringify({ planId, paymentMethod, transactionId, idpotencia }));
            formData.append('image', upgradeForm.receipt);
            const res = await fetch('/api/user/business/subscription', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            return data;
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(data.message || "Suscripción actualizada");
                idpotenciaRef.current = null;
                queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
                queryClient.invalidateQueries({ queryKey: ['planPayments', userId] });
                setPlanToUpgrade(null);
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al procesar suscripción");
        }
    });

    return (
        <div className="space-y-8">
            {planToUpgrade && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold">Mejorar a {planToUpgrade.name}</h3>
                            <button
                                onClick={() => setPlanToUpgrade(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Realiza el pago de <strong>${planToUpgrade.price}</strong> usando uno de nuestros métodos y registra la referencia abajo.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Selecciona el Método de Pago</label>
                                    <div className="grid gap-2">
                                        {systemPaymentMethods?.data?.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setUpgradeForm({
                                                    ...upgradeForm,
                                                    paymentMethod: `${method.type} - ${method.bankName || method.label}`,
                                                    selectedMethod: method
                                                })}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${upgradeForm.paymentMethod.startsWith(method.type)
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600'
                                                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                                        <CreditCard size={16} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">{method.label}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase">{method.type.replace('_', ' ')}</p>
                                                    </div>
                                                </div>
                                                {upgradeForm.paymentMethod.startsWith(method.type) && <CheckCircle2 size={16} className="text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {upgradeForm.selectedMethod && (
                                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl space-y-2 border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-1">
                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Datos de Pago</h4>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-400">Titular:</p>
                                                <p className="font-semibold">{upgradeForm.selectedMethod.ownerName}</p>
                                            </div>
                                            {upgradeForm.selectedMethod.ownerId && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Cédula/RIF:</p>
                                                    <p className="font-medium">{upgradeForm.selectedMethod.ownerId}</p>
                                                </div>
                                            )}
                                            {upgradeForm.selectedMethod.bankName && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Banco:</p>
                                                    <p className="font-medium">{upgradeForm.selectedMethod.bankName}</p>
                                                </div>
                                            )}
                                            {upgradeForm.selectedMethod.accountNumber && (
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-400">Número de Cuenta:</p>
                                                    <p className="font-mono font-medium">{upgradeForm.selectedMethod.accountNumber}</p>
                                                </div>
                                            )}
                                            {upgradeForm.selectedMethod.phoneNumber && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Teléfono:</p>
                                                    <p className="font-medium">{upgradeForm.selectedMethod.phoneNumber}</p>
                                                </div>
                                            )}
                                            {upgradeForm.selectedMethod.email && (
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-400">Correo:</p>
                                                    <p className="font-medium">{upgradeForm.selectedMethod.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subir Comprobante (Opcional)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                onChange={(e) => setUpgradeForm({ ...upgradeForm, receipt: e.target.files[0] })}
                                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium dark:border-gray-800 dark:bg-gray-950 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                                                accept="image/*"
                                            />
                                            <Camera className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic">Formatos permitidos: JPG, PNG. Máx 5MB.</p>
                                    </div>
                                    <label className="text-sm font-medium">Referencia o ID de Transacción</label>
                                    <input
                                        type="text"
                                        value={upgradeForm.transactionId}
                                        onChange={(e) => setUpgradeForm({ ...upgradeForm, transactionId: e.target.value })}
                                        placeholder="Ej: 12345678"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex gap-3 shrink-0">
                            <button
                                onClick={() => setPlanToUpgrade(null)}
                                className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={!upgradeForm.paymentMethod || !upgradeForm.transactionId || subscribeMutation.isPending}
                                onClick={() => subscribeMutation.mutate({
                                    planId: planToUpgrade.id,
                                    paymentMethod: upgradeForm.paymentMethod,
                                    transactionId: upgradeForm.transactionId,
                                    idpotencia: idpotenciaRef.current || generateIdpotencia()
                                })}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {subscribeMutation.isPending ? 'Procesando...' : 'Confirmar Pago'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {subscriptionData?.availablePlans?.map((plan) => {
                    const isCurrentPlan = subscriptionData?.subscription?.planId === plan.id;
                    return (
                        <div key={plan.id} className={`p-6 rounded-2xl border flex flex-col justify-between ${isCurrentPlan ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600' : 'border-gray-200'}`}>
                            <div>
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-3xl font-bold mt-2">${plan.price}<span className="text-sm text-gray-500 font-normal">/mes</span></p>
                                <p className="text-sm text-gray-600 mt-4">{plan.description}</p>
                                <ul className="mt-6 space-y-3">
                                    <li className="text-sm flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        Límite: {plan.productLimit} productos
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => {
                                    if (plan.price === 0) {
                                        if (!idpotenciaRef.current) idpotenciaRef.current = generateIdpotencia();
                                        subscribeMutation.mutate({ planId: plan.id, idpotencia: idpotenciaRef.current });
                                    } else {
                                        idpotenciaRef.current = generateIdpotencia();
                                        setPlanToUpgrade(plan);
                                    }
                                }}
                                disabled={isCurrentPlan || subscribeMutation.isPending}
                                className={`mt-8 w-full py-2 rounded-lg font-medium transition-colors ${isCurrentPlan ? 'bg-blue-100 text-blue-600 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {isCurrentPlan ? 'Plan Actual' : plan.price === 0 ? 'Elegir Plan' : 'Mejorar Plan'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {subscriptionData?.subscription && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900">Estado de tu Suscripción</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Plan actual:</p>
                            <p className="font-medium">{subscriptionData.subscription.plan.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Estado:</p>
                            <p className="font-medium text-green-600 uppercase">{subscriptionData.subscription.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Desde el:</p>
                            <p className="font-medium">{new Date(subscriptionData.subscription.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {planPaymentsData?.data && planPaymentsData.data.length > 0 && (
                <div className="mt-12 space-y-4">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <RefreshCw size={18} className="text-blue-600" />
                        Historial de Pagos de Planes
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Monto</th>
                                    <th className="px-4 py-3">Referencia</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {planPaymentsData.data.map((payment) => (
                                    <tr key={payment.id} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{payment.plan.name}</td>
                                        <td className="px-4 py-3">${payment.amount}</td>
                                        <td className="px-4 py-3 text-gray-500">{payment.transactionId}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${payment.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                payment.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
