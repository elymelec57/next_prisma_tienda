import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <FileQuestion className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Página no encontrada
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Lo sentimos, no pudimos encontrar la página que buscas. Verifica la URL o vuelve al inicio.
            </p>
            <div className="mt-10">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}
