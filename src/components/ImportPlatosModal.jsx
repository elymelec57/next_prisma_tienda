'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    Upload,
    FileSpreadsheet,
    Loader2,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Inbox,
} from 'lucide-react';
import Modal from '@/components/Modal';

const STATUS_LABELS = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando con IA...',
    COMPLETED: 'Completado',
    FAILED: 'Error',
};

const STATUS_STYLES = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    FAILED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export default function ImportPlatosModal({ isOpen, onClose, sucursalId, onSuccess }) {
    const [file, setFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [job, setJob] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const fileInputRef = useRef(null);

    const isProcessing = job?.status === 'PENDING' || job?.status === 'PROCESSING';
    const progress = job?.totalRows
        ? Math.min(100, Math.round(((job.successCount + job.errorCount) / job.totalRows) * 100))
        : 0;

    const loadRecentJobs = useCallback(async () => {
        try {
            const res = await fetch('/api/user/product/import?limit=5');
            const data = await res.json();
            if (data.status) setRecentJobs(data.jobs || []);
        } catch {
            // silencioso
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setFile(null);
            setJobId(null);
            setJob(null);
            loadRecentJobs();
        }
    }, [isOpen, loadRecentJobs]);

    useEffect(() => {
        if (!jobId) return;

        let active = true;
        const poll = async () => {
            try {
                const res = await fetch(`/api/user/product/import/${jobId}`);
                const data = await res.json();
                if (!active) return;

                if (data.status && data.job) {
                    setJob(data.job);
                    if (data.job.status === 'COMPLETED' || data.job.status === 'FAILED') {
                        clearInterval(interval);
                        loadRecentJobs();
                        if (onSuccess) onSuccess();
                    }
                }
            } catch {
                // silencioso
            }
        };

        const interval = setInterval(poll, 2000);
        poll();

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [jobId, loadRecentJobs, onSuccess]);

    const downloadTemplate = () => {
        const rows = [
            { nombre: 'Hamburguesa doble', precio: 8.5, descripcion: 'Dos carnes, queso y tocineta', categoria: 'Hamburguesas' },
            { nombre: 'Arepa reina', precio: 5, descripcion: '', categoria: 'Desayunos' },
        ];
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 40 }, { wch: 18 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Platos');
        XLSX.writeFile(wb, 'plantilla_platos.xlsx');
        toast.info('Plantilla descargada. La IA también acepta columnas con otros nombres.');
    };

    const onFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        const valid = /\.(xlsx|xls|csv)$/i.test(selected.name);
        if (!valid) {
            toast.error('Formato no válido. Usa .xlsx, .xls o .csv');
            e.target.value = '';
            return;
        }
        setFile(selected);
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('file', file);
            if (sucursalId) formData.append('sucursalId', sucursalId);
            const res = await fetch('/api/user/product/import', {
                method: 'POST',
                body: formData,
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(data.message);
                setJobId(data.jobId);
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error('Error al subir el archivo');
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Importación masiva de productos">
            <div className="mt-2 space-y-5">
                {!jobId ? (
                    <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sube un archivo Excel (o CSV) con tu menú. La IA interpreta las columnas
                            automáticamente y normaliza nombre, precio, descripción y categoría.
                            El proceso corre en segundo plano, puedes cerrar esta ventana.
                        </p>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={downloadTemplate}
                                className="inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 border border-gray-200 bg-white hover:bg-gray-100 h-9 px-3 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Descargar plantilla
                            </button>
                        </div>

                        <label
                            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <FileSpreadsheet className="h-10 w-10 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {file ? file.name : 'Selecciona un archivo Excel'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : '.xlsx, .xls o .csv (máx 10MB)'}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".xlsx,.xls,.csv"
                                onChange={onFileChange}
                            />
                        </label>

                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => uploadMutation.mutate()}
                                disabled={!file || uploadMutation.isPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                            >
                                {uploadMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                )}
                                Subir e importar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isProcessing ? (
                                    <Clock className="h-5 w-5 text-blue-500" />
                                ) : job?.status === 'COMPLETED' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {STATUS_LABELS[job?.status] || 'Procesando'}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{file?.name || job?.fileName}</span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-500">Progreso</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-800 overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{job?.totalRows ?? 0}</p>
                                <p className="text-xs text-gray-500">Filas</p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <p className="text-2xl font-bold text-green-600">{job?.successCount ?? 0}</p>
                                <p className="text-xs text-gray-500">Importados</p>
                            </div>
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-2xl font-bold text-red-600">{job?.errorCount ?? 0}</p>
                                <p className="text-xs text-gray-500">Omitidos</p>
                            </div>
                        </div>

                        {job?.errors?.length > 0 && (
                            <div className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                                {job.errors.map((err, i) => (
                                    <p key={i}>• {err.message}</p>
                                ))}
                            </div>
                        )}

                        {!isProcessing && (
                            <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {recentJobs.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Importaciones recientes</p>
                        <div className="space-y-2">
                            {recentJobs.map((j) => (
                                <div key={j.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-300 truncate">{j.fileName}</span>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${STATUS_STYLES[j.status]}`}>
                                        {STATUS_LABELS[j.status]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {job?.status === 'PROCESSING' && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Esto puede tardar unos segundos. Puedes cerrar la ventana y seguir navegando.
                    </div>
                )}
            </div>
        </Modal>
    );
}