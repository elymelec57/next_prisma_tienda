import NavBar from "@/components/NavBar";
import 'react-toastify/dist/ReactToastify.css';

import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import { ToastContainer } from 'react-toastify';

export default async function LayoutDashboard({ children }) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    let decoded = { data: {} };

    if (token) {
        try {
            decoded = jwt.verify(token.value, process.env.JWT_TOKEN);
        } catch (error) {
            // Manejar token inválido si es necesario
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <NavBar data={decoded.data} />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <ToastContainer />
        </div>
    );
}