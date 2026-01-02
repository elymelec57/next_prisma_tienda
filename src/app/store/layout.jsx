import NavBar from "@/components/NavBar";
import 'react-toastify/dist/ReactToastify.css';

import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import { ToastContainer } from 'react-toastify';

export default async function LayoutDashboard({ children }) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    const decoded = jwt.verify(token.value, process.env.JWT_TOKEN);

    return (
        <>
            <div>
                <NavBar data={decoded.data} />
            </div>
            {children}
            <ToastContainer />
        </>
    );
}