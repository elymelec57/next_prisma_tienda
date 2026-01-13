'use client';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all dark:bg-gray-950 sm:my-8 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
